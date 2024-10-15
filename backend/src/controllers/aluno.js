import Aluno from '../models/aluno.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';

class ControllerAluno {
    async store(req, res) {
        const { nome, cpf, endereco, telefone } = req.body;

        if (!nome || !cpf || !endereco || !telefone) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const aluno = await Aluno.create({
            nome,
            cpf,
            endereco,
            telefone,
        });

        res.json(aluno);
    }

    async index(req, res) {
        const alunos = await Aluno.findAll();

        return res.json(alunos);
    }

    async show(req, res) {
        const { id } = req.params;
        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        return res.json(aluno);
    }

    async showActives(req, res) {
        const alunos = await Aluno.findAll({
            where: {
                status: 'ativo',
            },
        });

        return res.json(alunos);
    }

    async update(req, res) {
        const { id } = req.params;
        const { nome, cpf, endereco, telefone } = req.body;

        if (!nome || !cpf || !endereco || !telefone) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        aluno.nome = nome;
        aluno.cpf = cpf;
        aluno.endereco = endereco;
        aluno.telefone = telefone;
        await aluno.save();

        return res.json(aluno);
    }

    async activate(req, res) {
        const { id } = req.params;
        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        aluno.status = 'ativo';
        await aluno.save();

        return res.json(aluno);
    }

    async disable(req, res) {
        const { id } = req.params;
        const aluno = await Aluno.findByPk(id);

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        aluno.status = 'inativo';
        await aluno.save();

        const alunoHasTurmas = await AlunoHasTurma.findAll({
            where: {
                idAluno: aluno.idAluno,
            },
        });

        if (alunoHasTurmas) {
            alunoHasTurmas.forEach(async (alunoHasTurma) => {
                alunoHasTurma.status = 'inativo';
                await alunoHasTurma.save();
            });
        }

        return res.json(aluno);
    }
}

export default new ControllerAluno();
