import Turma from '../models/turma.js';

class ControllerTurma {
    async store(req, res) {
        const {
            nome,
            semestreAno,
            horario,
            status,
            idSala,
            idDisciplina,
            idProfessor,
        } = req.body;

        const turma = await Turma.create({
            nome,
            semestreAno,
            horario,
            status,
            idSala,
            idDisciplina,
            idProfessor,
        });

        return res.json(turma);
    }

    async index(req, res) {
        const turma = await Turma.findAll();
        return res.json(turma);
    }

    async show(req, res) {
        const { id } = req.params;
        const turma = await Turma.findByPk(id);
        return res.json(turma);
    }

    async showActives(req, res) {
        const turma = await Turma.findAll({
            where: {
                status: 'ativo',
            },
        });
        return res.json(turma);
    }

    async update(req, res) {
        const { id } = req.params;
        const {
            nome,
            semestreAno,
            horario,
            status,
            idSala,
            idDisciplina,
            idProfessor,
        } = req.body;
        const turma = await Turma.findByPk(id);
        turma.nome = nome;
        turma.semestreAno = semestreAno;
        turma.horario = horario;
        turma.status = status;
        turma.idSala = idSala;
        turma.idDisciplina = idDisciplina;
        turma.idProfessor = idProfessor;
        await turma.save();
        return res.json(turma);
    }

    async enable(req, res) {
        const { id } = req.params;
        const turma = await Turma.findByPk(id);
        turma.status = 'ativo';
        await turma.save();
        return res.json(turma);
    }

    async disable(req, res) {
        const { id } = req.params;
        const turma = await Turma.findByPk(id);
        turma.status = 'inativo';
        await turma.save();
        return res.json(turma);
    }
}

export default new ControllerTurma();
