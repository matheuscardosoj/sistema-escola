import Sala from '../models/sala.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

class ControllerSala {
    async store(req, res) {
        console.log('Recebendo requisição POST em /sala/create');

        const { nome, local, capacidade } = req.body;

        if (!nome || !local || !capacidade) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        const sala = await Sala.create({
            nome,
            local,
            capacidade,
        });

        return res.json(sala);
    }

    async index(req, res) {
        console.log('Recebendo requisição GET em /sala');

        const salas = await Sala.findAll({
            order: ['idSala'],
        });

        return res.json(salas);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /sala/:id');

        const { id } = req.params;
        const sala = await Sala.findByPk(id, {
            order: ['idSala'],
        });

        if (!sala) {
            return res.status(404).json({ erro: 'Sala não encontrada' });
        }

        return res.json(sala);
    }

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrar } = req.body;
        
        if (!filtro || !mostrar) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        if (mostrar === 'ativo') {
            const salas = await Sala.findAll({
                where: {
                    status: 'ativo',
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { local: { [Op.iLike]: `%${filtro}%` } },
                    ],
                },
            });

            return res.json(salas);
        } else if (mostrar === 'inativo') {
            const salas = await Sala.findAll({
                where: {
                    status: 'inativo',
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { local: { [Op.iLike]: `%${filtro}%` } },
                    ],
                },
            });

            return res.json(salas);
        } else if (mostrar === 'todos') {
            const salas = await Sala.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { local: { [Op.iLike]: `%${filtro}%` } },
                    ],
                },
            });

            return res.json(salas);
        } else {
            return res.status(400).json({ erro: 'Mostrar deve ser "ativo", "inativo" ou "todos"' });
        }
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /sala/actives');

        const salas = await Sala.findAll({
            where: {
                status: 'ativo',
            },
            order: ['idSala'],
        });

        return res.json(salas);
    }

    async showInactives(req, res) {
        console.log('Recebendo requisição GET em /sala/inactives');

        const salas = await Sala.findAll({
            where: {
                status: 'inativo',
            },
            order: ['idSala'],
        });

        return res.json(salas);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /sala/update/:id');

        const { id } = req.params;
        const { nome, local, capacidade } = req.body;

        if (!nome || !local || !capacidade) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        const sala = await Sala.findByPk(id);

        if (!sala) {
            return res.status(404).json({ erro: 'Sala não encontrada' });
        }

        sala.nome = nome;
        sala.local = local;
        sala.capacidade = capacidade;
        
        await sala.save();

        return res.json(sala);
    }

    async activate(req, res) {
        console.log('Recebendo requisição PUT em /sala/activate/:id');

        const { id } = req.params;
        const sala = await Sala.findByPk(id);

        if (!sala) {
            return res.status(404).json({ erro: 'Sala não encontrada' });
        }

        sala.status = 'ativo';
        await sala.save();

        return res.json(sala);
    }

    async disable(req, res) {
        console.log('Recebendo requisição PUT em /sala/disable/:id');

        const { id } = req.params;
        const sala = await Sala.findByPk(id);

        if (!sala) {
            return res.status(404).json({ erro: 'Sala não encontrada' });
        }

        sala.status = 'inativo';
        await sala.save();

        const turmas = await Turma.findAll({
            where: {
                idSala: sala.idSala,
            },
        });

        if (turmas) {
            turmas.forEach(async (turma) => {
                turma.status = 'inativo';
                await turma.save();

                const alunoHasTurma = await AlunoHasTurma.findAll({
                    where: {
                        idTurma: turma.idTurma,
                    },
                });

                if (alunoHasTurma) {
                    alunoHasTurma.forEach(async (aluno) => {
                        aluno.status = 'inativo';
                        await aluno.save();
                    });
                }
            });
        }

        return res.json(sala);
    }
}

export default new ControllerSala();
