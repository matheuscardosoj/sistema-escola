import Turma from '../models/turma.js';
import Disciplina from '../models/disciplina.js';
import Professor from '../models/professor.js';
import Sala from '../models/sala.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

class ControllerTurma {
    async store(req, res) {
        console.log('Recebendo requisição POST em /turma/create');

        const {
            nome,
            semestreAno,
            horarioInicio,
            horarioFim,
            idSala,
            idDisciplina,
            idProfessor,
        } = req.body;

        if (
            !nome ||
            !semestreAno ||
            !horarioInicio ||
            !horarioFim ||
            !idSala ||
            !idDisciplina ||
            !idProfessor
        ) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

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
        console.log('Recebendo requisição GET em /turma');

        const turma = await Turma.findAll({
            order: ['idTurma'],
        });

        return res.json(turma);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /turma/:id');

        const { id } = req.params;
        const turma = await Turma.findByPk(id, {
            order: ['idTurma'],
        });

        if (!turma) {
            return res.status(400).json({ error: 'Turma não encontrada' });
        }

        return res.json(turma);
    }

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrarInativas } = req.body;

        console.log(filtro, mostrarInativas);

        let turmas;

        if(mostrarInativas === undefined) {
            res.status(400).json({ error: 'Preencha o campo mostrarInativas' });
        }

        if (!filtro) {
            if(mostrarInativas) {
                turmas = await Turma.findAll({
                    order: ['idTurma'],
                });
            } else {
                turmas = await Turma.findAll({
                    where: {
                        status: 'ativo',
                    },
                    order: ['idTurma'],
                });
            }

            return res.json(turmas);
        }

        if(mostrarInativas) {
            turmas = await Turma.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                    ]
                },
                order: ['idTurma'],
            });

            return res.json(turmas);
        }        

        turmas = await Turma.findAll({
            where: {
                status: 'ativo',
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${filtro}%` } },
                ]
            },
            order: ['idTurma'],
        });

        return res.json(turmas);
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /turma/actives');

        const turma = await Turma.findAll({
            where: {
                status: 'ativo',
            },
            order: ['idTurma'],
        });

        return res.json(turma);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /turma/update/:id');

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

        if (
            !nome ||
            !semestreAno ||
            !horarioInicio ||
            !horarioFim ||
            !status ||
            !idSala ||
            !idDisciplina ||
            !idProfessor
        ) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

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
        console.log('Recebendo requisição PUT em /turma/activate/:id');

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
        console.log('Recebendo requisição PUT em /turma/disable/:id');

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
