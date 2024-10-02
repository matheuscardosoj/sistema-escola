import Sala from '../models/sala.js';

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
        sala.nome = nome;
        sala.capacidade = capacidade;
        await sala.save();
        return res.json(sala);
    }

    async enable(req, res) {
        const { id } = req.params;
        const sala = await Sala.findByPk(id);
        sala.status = 'ativo';
        await sala.save();
        return res.json(sala);
    }

    async disable(req, res) {
        const { id } = req.params;
        const sala = await Sala.findByPk(id);
        sala.status = 'inativo';
        await sala.save();
        return res.json(sala);
    }
}

export default new ControllerSala();
