import Aluno from '../models/aluno.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import Turma from '../models/turma.js';

class ControllerAlunoHasTurma {
    async store(req, res) {
        console.log('Recebendo requisição POST em /alunoHasTurma/create');

        const { idAluno, idTurma } = req.body;

        if (!idAluno || !idTurma) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

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
            if (alunoHasTurmaExists.status === 'ativo') {
                return res.status(400).json({ error: 'Aluno já cadastrado' });
            }

            alunoHasTurmaExists.status = 'ativo';
            await alunoHasTurmaExists.save();

            return res.json(alunoHasTurmaExists);
        }

        const alunoHasTurma = await AlunoHasTurma.create({
            idAluno,
            idTurma,
        });

        return res.json(alunoHasTurma);
    }

    async index(req, res) {
        console.log('Recebendo requisição GET em /alunoHasTurma');

        const alunoHasTurma = await AlunoHasTurma.findAll();

        return res.json(alunoHasTurma);
    }

    async show(req, res) {
        console.log('Recebendo requisição POST em /alunoHasTurma');

        const { idAluno, idTurma } = req.body;

        if (!idAluno || !idTurma) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

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
        console.log('Recebendo requisição GET em /alunoHasTurma/actives');

        const alunoHasTurma = await AlunoHasTurma.findAll({
            where: {
                status: 'ativo',
            },
        });

        return res.json(alunoHasTurma);
    }

    async showInactives(req, res) {
        console.log('Recebendo requisição GET em /alunoHasTurma/inactives');

        const alunoHasTurma = await AlunoHasTurma.findAll({
            where: {
                status: 'inativo',
            },
        });

        return res.json(alunoHasTurma);
    }

    async activate(req, res) {
        console.log('Recebendo requisição PUT em /alunoHasTurma/activate');

        const { idAluno, idTurma } = req.body;

        if (!idAluno || !idTurma) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

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
        console.log('Recebendo requisição PUT em /alunoHasTurma/disable');

        const { idAluno, idTurma } = req.body;

        if (!idAluno || !idTurma) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

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
