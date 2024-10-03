import Professor from '../models/professor.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';

class ControllerProfessor {
    async store(req, res) {
        const { nome, cpf, endereco, telefone } = req.body;

        const professor = await Professor.create({
            nome,
            cpf,
            endereco,
            telefone,
        });

        return res.json(professor);
    }

    async index(req, res) {
        const professor = await Professor.findAll();

        return res.json(professor);
    }

    async show(req, res) {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        return res.json(professor);
    }

    async showActives(req, res) {
        const professor = await Professor.findAll({
            where: {
                status: 'ativo',
            },
        });

        return res.json(professor);
    }

    async update(req, res) {
        const { id } = req.params;
        const { nome, cpf, endereco, telefone } = req.body;
        const professor = await Professor.findByPk(id);

        console.log(req.body, id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        professor.nome = nome;
        professor.cpf = cpf;
        professor.endereco = endereco;
        professor.telefone = telefone;
        await professor.save();

        return res.json(professor);
    }

    async activate(req, res) {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        professor.status = 'ativo';
        await professor.save();

        return res.json(professor);
    }

    async disable(req, res) {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        professor.status = 'inativo';
        await professor.save();

        const turmas = await Turma.findAll({
            where: {
                idProfessor: professor.idProfessor,
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

        return res.json(professor);
    }
}

export default new ControllerProfessor();
