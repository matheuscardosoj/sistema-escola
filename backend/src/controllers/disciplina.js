import Disciplina from '../models/disciplina.js';

class ControllerDisciplina {
    async store(req, res) {
        const { nome, descricao } = req.body;

        const disciplina = await Disciplina.create({
            nome,
            descricao,
        });

        return res.json(disciplina);
    }

    async index(req, res) {
        const disciplina = await Disciplina.findAll();
        return res.json(disciplina);
    }

    async show(req, res) {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);
        return res.json(disciplina);
    }

    async showActives(req, res) {
        const disciplina = await Disciplina.findAll({
            where: {
                status: 'ativo',
            },
        });
        return res.json(disciplina);
    }

    async update(req, res) {
        const { id } = req.params;
        const { nome, descricao } = req.body;
        const disciplina = await Disciplina.findByPk(id);
        disciplina.nome = nome;
        disciplina.descricao = descricao;
        await disciplina.save();
        return res.json(disciplina);
    }

    async enable(req, res) {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);
        disciplina.status = 'ativo';
        await disciplina.save();
        return res.json(disciplina);
    }

    async disable(req, res) {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);
        disciplina.status = 'inativo';
        await disciplina.save();
        return res.json(disciplina);
    }
}

export default new ControllerDisciplina();
