import Disciplina from '../models/disciplina.js';
import Turma from '../models/turma.js';

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

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

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

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.nome = nome;
        disciplina.descricao = descricao;

        await disciplina.save();

        return res.json(disciplina);
    }

    async activate(req, res) {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.status = 'ativo';
        await disciplina.save();

        return res.json(disciplina);
    }

    async disable(req, res) {
        const { id } = req.params;
        const disciplina = await Disciplina.findByPk(id);

        if (!disciplina) {
            return res.status(400).json({ error: 'Disciplina não encontrada' });
        }

        disciplina.status = 'inativo';
        await disciplina.save();

        const turmas = await Turma.findAll({
            where: {
                disciplinaId: disciplina.idDisciplina,
            },
        });

        if (turmas) {
            turmas.forEach(async (turma) => {
                turma.status = 'inativo';
                await turma.save();
            });
        }

        return res.json(disciplina);
    }
}

export default new ControllerDisciplina();
