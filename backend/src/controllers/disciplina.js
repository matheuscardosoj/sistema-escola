import Disciplina from '../models/disciplina.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

class ControllerDisciplina {
    async store(req, res) {
        console.log('Recebendo requisição POST em /disciplina/create');

        const { nome, descricao } = req.body;

        if (!nome || !descricao) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const disciplina = await Disciplina.create({
            nome,
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

        const { filtro, mostrarInativas } = req.body;

        console.log(filtro, mostrarInativas);

        let disciplinas;

        if(mostrarInativas === undefined) {
            res.status(400).json({ error: 'Preencha o campo mostrarInativas' });
        }

        if (!filtro) {
            if(mostrarInativas) {
                disciplinas = await Disciplina.findAll({
                    order: ['idDisciplina'],
                });
            } else {
                disciplinas = await Disciplina.findAll({
                    where: {
                        status: 'ativo',
                    },
                    order: ['idDisciplina'],
                });
            }

            return res.json(disciplinas);
        }

        if(mostrarInativas) {
            disciplinas = await Disciplina.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { descricao: { [Op.iLike]: `%${filtro}%` } },
                    ]
                },
                order: ['idDisciplina'],
            });

            return res.json(disciplinas);
        }        

        disciplinas = await Disciplina.findAll({
            where: {
                status: 'ativo',
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${filtro}%` } },
                    { descricao: { [Op.iLike]: `%${filtro}%` } },
                ],
            },
            order: ['idDisciplina'],
        });

        return res.json(disciplinas);
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /disciplina/actives');

        const disciplina = await Disciplina.findAll({
            where: {
                status: 'ativo',
            },
            order: ['idDisciplina'],
        });

        return res.json(disciplina);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /disciplina/update/:id');

        const { id } = req.params;
        const { nome, descricao } = req.body;

        if (!nome || !descricao) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.nome = nome;
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
