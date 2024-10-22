import Sala from '../models/sala.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

class ControllerSala {
    async store(req, res) {
        console.log('Recebendo requisição POST em /sala/create');

        const { nome, capacidade } = req.body;

        if (!nome || !capacidade) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        const sala = await Sala.create({
            nome,
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

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrarInativas } = req.body;

        console.log(filtro, mostrarInativas);

        let salas;

        if(mostrarInativas === undefined) {
            res.status(400).json({ error: 'Preencha o campo mostrarInativas' });
        }

        if (!filtro) {
            if(mostrarInativas) {
                salas = await Sala.findAll({
                    order: ['idSala'],
                });
            } else {
                salas = await Sala.findAll({
                    where: {
                        status: 'ativo',
                    },
                    order: ['idSala'],
                });
            }

            return res.json(salas);
        }

        if(mostrarInativas) {
            salas = await Sala.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                    ]
                },
                order: ['idSala'],
            });

            return res.json(salas);
        }        

        salas = await Sala.findAll({
            where: {
                status: 'ativo',
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${filtro}%` } },
                ]
            },
            order: ['idSala'],
        });

        return res.json(salas);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /sala/update/:id');

        const { id } = req.params;
        const { nome, capacidade } = req.body;

        if (!nome || !capacidade) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        const sala = await Sala.findByPk(id);

        if (!sala) {
            return res.status(404).json({ erro: 'Sala não encontrada' });
        }

        sala.nome = nome;
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
