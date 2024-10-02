import Aluno from '../models/aluno.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import Turma from '../models/turma.js';

class ControllerAlunoHasTurma {
    async store(req, res) {
        const { idAluno, idTurma } = req.body;

        const aluno = await Aluno.findByPk(idAluno);
        const turma = await Turma.findByPk(idTurma);

        if (!aluno || !turma) {
            return res
                .status(400)
                .json({ error: 'Aluno ou turma não encontrados' });
        }

        const alunoHasTurmaExists = await AlunoHasTurma.findOne({
            where: {
                idAluno,
                idTurma,
            },
        });

        if (alunoHasTurmaExists) {
            return res
                .status(400)
                .json({ error: 'Aluno já cadastrado nesta turma' });
        }

        const alunoHasTurma = await AlunoHasTurma.create({
            idAluno,
            idTurma,
        });

        return res.json(alunoHasTurma);
    }

    async index(req, res) {
        const alunoHasTurma = await AlunoHasTurma.findAll();

        return res.json(alunoHasTurma);
    }

    async show(req, res) {
        const { idAluno, idTurma } = req.body;

        const alunoHasTurma = await AlunoHasTurma.findOne({
            where: {
                idAluno,
                idTurma,
            },
        });

        if (!alunoHasTurma) {
            return res
                .status(400)
                .json({ error: 'Aluno não encontrado nesta turma' });
        }

        return res.json(alunoHasTurma);
    }

    async showActives(req, res) {
        const alunoHasTurma = await AlunoHasTurma.findAll({
            where: {
                status: 'ativo',
            },
        });

        return res.json(alunoHasTurma);
    }

    async activate(req, res) {
        const { idAluno, idTurma } = req.body;

        const alunoHasTurma = await AlunoHasTurma.findOne({
            where: {
                idAluno,
                idTurma,
            },
        });

        if (!alunoHasTurma) {
            return res
                .status(400)
                .json({ error: 'Aluno não encontrado nesta turma' });
        }

        const aluno = await Aluno.findByPk(idAluno);
        const turma = await Turma.findByPk(idTurma);

        if (aluno.status === 'inativo' || turma.status === 'inativo') {
            return res.status(400).json({ error: 'Aluno ou turma inativos' });
        }

        alunoHasTurma.status = 'ativo';
        await alunoHasTurma.save();

        return res.json(alunoHasTurma);
    }

    async disable(req, res) {
        const { idAluno, idTurma } = req.body;

        const alunoHasTurma = await AlunoHasTurma.findOne({
            where: {
                idAluno,
                idTurma,
            },
        });

        if (!alunoHasTurma) {
            return res
                .status(400)
                .json({ error: 'Aluno não encontrado nesta turma' });
        }

        alunoHasTurma.status = 'inativo';
        await alunoHasTurma.save();

        return res.json(alunoHasTurma);
    }
}

export default new ControllerAlunoHasTurma();
