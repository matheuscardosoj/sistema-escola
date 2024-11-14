import Disciplina from '../models/disciplina.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

class ControllerDisciplina {
    async store(req, res) {
        console.log('Recebendo requisição POST em /disciplina/create');

        const { nome, codigo, periodo, descricao } = req.body;

        if (!nome || !codigo || !periodo || !descricao) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const disciplina = await Disciplina.create({
            nome,
            codigo,
            periodo,
            descricao,
        });

        return res.json(disciplina);
    }

    async index(req, res) {
        console.log('Recebendo requisição GET em /disciplina');

        const disciplina = await Disciplina.findAll({
            order: ['idDisciplina'],
        });

        return res.json(disciplina);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /disciplina/:id');

        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id, {
            order: ['idDisciplina'],
        });

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        return res.json(disciplina);
    }

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrar } = req.body;

        if (!filtro || !mostrar) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        if (mostrar === 'ativo') {
            const disciplinas = await Disciplina.findAll({
                where: {
                    status: 'ativo',
                    [Op.or]: [
                        { nome: { [Op.like]: `%${filtro}%` } },
                        { codigo: { [Op.like]: `%${filtro}%` } },
                        { descricao: { [Op.like]: `%${filtro}%` } },
                    ],
                },
                order: ['idDisciplina'],
            });

            return res.json(disciplinas);
        } else if (mostrar === 'inativo') {
            const disciplinas = await Disciplina.findAll({
                where: {
                    status: 'inativo',
                    [Op.or]: [
                        { nome: { [Op.like]: `%${filtro}%` } },
                        { codigo: { [Op.like]: `%${filtro}%` } },
                        { descricao: { [Op.like]: `%${filtro}%` } },
                    ],
                },
                order: ['idDisciplina'],
            });

            return res.json(disciplinas);
        } else if (mostrar === 'todos') {
            const disciplinas = await Disciplina.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.like]: `%${filtro}%` } },
                        { codigo: { [Op.like]: `%${filtro}%` } },
                        { descricao: { [Op.like]: `%${filtro}%` } },
                    ],
                },
                order: ['idDisciplina'],
            });

            return res.json(disciplinas);
        } else {
            return res.status(400).json({ error: 'Mostrar deve ser "ativo", "inativo" ou "todos"' });
        }
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /disciplina/actives');

        const disciplinas = await Disciplina.findAll({
            where: {
                status: 'ativo',
            },
            order: ['idDisciplina'],
        });

        return res.json(disciplinas);
    }

    async showInactives(req, res) {
        console.log('Recebendo requisição GET em /disciplina/inactives');

        const disciplinas = await Disciplina.findAll({
            where: {
                status: 'inativo',
            },
            order: ['idDisciplina'],
        });

        return res.json(disciplinas);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /disciplina/update/:id');

        const { id } = req.params;
        const { nome, codigo, periodo, descricao } = req.body;

        console.log(req.body);        

        if (!nome || !codigo || !periodo || !descricao) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.nome = nome;
        disciplina.codigo = codigo;
        disciplina.periodo = periodo;
        disciplina.descricao = descricao;

        await disciplina.save();

        return res.json(disciplina);
    }

    async activate(req, res) {
        console.log('Recebendo requisição PUT em /disciplina/activate/:id');

        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.status = 'ativo';
        await disciplina.save();

        return res.json(disciplina);
    }

    async disable(req, res) {
        console.log('Recebendo requisição PUT em /disciplina/disable/:id');

        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.status = 'inativo';
        await disciplina.save();

        const turmas = await Turma.findAll({
            where: {
                idDisciplina: disciplina.idDisciplina,
            },
        });

        if (turmas) {
            turmas.forEach(async (turma) => {
                turma.status = 'inativo';
                await turma.save();

                const alunosHasTurma = await AlunoHasTurma.findAll({
                    where: {
                        idTurma: turma.idTurma,
                    },
                });

                if (alunosHasTurma) {
                    alunosHasTurma.forEach(async (alunoHasTurma) => {
                        alunoHasTurma.status = 'inativo';
                        await alunoHasTurma.save();
                    });
                }
            });
        }

        return res.json(disciplina);
    }
}

export default new ControllerDisciplina();
