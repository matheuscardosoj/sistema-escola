import Turma from '../models/turma.js';
import Disciplina from '../models/disciplina.js';
import Professor from '../models/professor.js';
import Sala from '../models/sala.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';

class ControllerTurma {
    async store(req, res) {
        const {
            nome,
            semestreAno,
            horarioInicio,
            horarioFim,
            idSala,
            idDisciplina,
            idProfessor,
        } = req.body;

        const disciplina = await Disciplina.findByPk(idDisciplina);
        const professor = await Professor.findByPk(idProfessor);
        const sala = await Sala.findByPk(idSala);

        if (!disciplina || !professor || !sala) {
            return res.status(400).json({
                error: 'Disciplina, professor ou sala não encontrados',
            });
        }

        if (
            disciplina.status === 'inativo' ||
            professor.status === 'inativo' ||
            sala.status === 'inativo'
        ) {
            return res
                .status(400)
                .json({ error: 'Disciplina, professor ou sala inativos' });
        }

        const turma = await Turma.create({
            nome,
            semestreAno,
            horarioInicio,
            horarioFim,
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

        if (!turma) {
            return res.status(400).json({ error: 'Turma não encontrada' });
        }

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
            horarioInicio,
            horarioFim,
            status,
            idSala,
            idDisciplina,
            idProfessor,
        } = req.body;
        const turma = await Turma.findByPk(id);

        if (!turma) {
            return res.status(400).json({ error: 'Turma não encontrada' });
        }

        turma.nome = nome;
        turma.semestreAno = semestreAno;
        turma.horarioInicio = horarioInicio;
        turma.horarioFim = horarioFim;
        turma.status = status;
        turma.idSala = idSala;
        turma.idDisciplina = idDisciplina;
        turma.idProfessor = idProfessor;

        await turma.save();

        return res.json(turma);
    }

    async activate(req, res) {
        const { id } = req.params;
        console.log(id);

        const turma = await Turma.findByPk(id);

        if (!turma) {
            return res.status(400).json({ error: 'Turma não encontrada' });
        }

        const disciplina = await Disciplina.findByPk(turma.idDisciplina);
        const professor = await Professor.findByPk(turma.idProfessor);
        const sala = await Sala.findByPk(turma.idSala);

        if (
            disciplina.status === 'inativo' ||
            professor.status === 'inativo' ||
            sala.status === 'inativo'
        ) {
            return res
                .status(400)
                .json({ error: 'Disciplina, professor ou sala inativos' });
        }

        turma.status = 'ativo';
        await turma.save();

        return res.json(turma);
    }

    async disable(req, res) {
        const { id } = req.params;
        const turma = await Turma.findByPk(id);

        if (!turma) {
            return res.status(400).json({ error: 'Turma não encontrada' });
        }

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

        return res.json(turma);
    }
}

export default new ControllerTurma();
