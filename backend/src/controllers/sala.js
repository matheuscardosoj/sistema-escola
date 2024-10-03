import Sala from '../models/sala.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';

class ControllerSala {
    async store(req, res) {
        const { nome, capacidade } = req.body;
        const sala = await Sala.create({
            nome,
            capacidade,
        });

        return res.json(sala);
    }

    async index(req, res) {
        const salas = await Sala.findAll();

        return res.json(salas);
    }

    async show(req, res) {
        const { id } = req.params;
        const sala = await Sala.findByPk(id);

        if (!sala) {
            return res.status(404).json({ erro: 'Sala não encontrada' });
        }

        return res.json(sala);
    }

    async showActives(req, res) {
        const salas = await Sala.findAll({
            where: {
                status: 'ativo',
            },
        });

        return res.json(salas);
    }

    async update(req, res) {
        const { id } = req.params;
        const { nome, capacidade } = req.body;
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
