import Professor from '../models/professor.js';

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
        professor.nome = nome;
        professor.cpf = cpf;
        professor.endereco = endereco;
        professor.telefone = telefone;
        await professor.save();
        return res.json(professor);
    }

    async enable(req, res) {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);
        professor.status = 'ativo';
        await professor.save();
        return res.json(professor);
    }

    async disable(req, res) {
        const { id } = req.params;
        const professor = await Professor.findByPk(id);
        professor.status = 'inativo';
        await professor.save();
        return res.json(professor);
    }
}

export default new ControllerProfessor();
