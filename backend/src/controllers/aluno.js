import Aluno from '../models/aluno.js';

class ControllerAluno {
    async store(req, res) {
        const { nome, cpf, endereco, telefone } = req.body;
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
        const aluno = await Aluno.findByPk(id);
        aluno.nome = nome;
        aluno.cpf = cpf;
        aluno.endereco = endereco;
        aluno.telefone = telefone;
        await aluno.save();
        return res.json(aluno);
    }

    async enable(req, res) {
        const { id } = req.params;
        const aluno = await Aluno.findByPk(id);
        aluno.status = 'ativo';
        await aluno.save();
        return res.json(aluno);
    }

    async disable(req, res) {
        const { id } = req.params;
        const aluno = await Aluno.findByPk(id);
        aluno.status = 'inativo';
        await aluno.save();
        return res.json(aluno);
    }
}

export default new ControllerAluno();
