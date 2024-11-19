import Turma from '../models/turma.js';
import Disciplina from '../models/disciplina.js';
import Professor from '../models/professor.js';
import Sala from '../models/sala.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';
import Aluno from '../models/aluno.js';

class ControllerTurma {
    async store(req, res) {
        console.log('Recebendo requisição POST em /turma/create');

        const {
            nome,
            diaSemana,
            horarioInicio,
            horarioTermino,
            idSala,
            idDisciplina,
            idProfessor
        } = req.body;

        if (
            !nome ||
            !diaSemana ||
            !horarioInicio ||
            !horarioTermino ||
            !idSala ||
            !idDisciplina ||
            !idProfessor
        ) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        console.log(req.body);
        

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
            diaSemana,
            horarioInicio,
            horarioTermino,
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
            attributes: {
                exclude: ['idDisciplina', 'idProfessor', 'idSala'],
            },
            include: [
                {
                    model: Disciplina, 
                    as: 'disciplina',
                },
                {
                    model: Professor,
                    as: 'professor',
                },
                {
                    model: Sala,
                    as: 'sala',
                },
                {
                    model: Aluno,
                    as: 'alunos',
                    // through: { attributes: [] },
                    required: false,
                }
            ],
        });

        return res.json(turma);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /turma/:id');

        const { id } = req.params;
        const turma = await Turma.findByPk(id, {
            order: ['idTurma'],
            attributes: {
                exclude: ['idDisciplina', 'idProfessor', 'idSala'],
            },
            include: [
                {
                    model: Disciplina,
                    as: 'disciplina',
                },
                {
                    model: Professor,
                    as: 'professor',
                },
                {
                    model: Sala,
                    as: 'sala',
                },
                {
                    model: Aluno,
                    as: 'alunos',
                    through: { attributes: [] },
                    required: false,
                }
            ],
        });

        if (!turma) {
            return res.status(400).json({ error: 'Turma não encontrada' });
        }

        return res.json(turma);
    }

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrar } = req.body;

        if (!filtro || !mostrar) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        if (mostrar === 'ativo') {
            const turma = await Turma.findAll({
                where: {
                    status: 'ativo',
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { diaSemana: { [Op.iLike]: `%${filtro}%` } },
                    ],
                },
                order: ['idTurma'],
                attributes: {
                    exclude: ['idDisciplina', 'idProfessor', 'idSala'],
                },
                include: [
                    {
                        model: Disciplina,
                        as: 'disciplina',
                    },
                    {
                        model: Professor,
                        as: 'professor',
                    },
                    {
                        model: Sala,
                        as: 'sala',
                    },
                    {
                        model: Aluno,
                        as: 'alunos',
                        status: 'ativo',
                        where: {
                            status: 'ativo',
                        },
                        through: { 
                            where: { status: 'ativo' },
                            attributes: [],
                        },
                        required: false,
                    }
                ],
            });

            return res.json(turma);
        } else if (mostrar === 'inativo') {
            const turma = await Turma.findAll({
                where: {
                    status: 'inativo',
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { diaSemana: { [Op.iLike]: `%${filtro}%` } },
                    ],
                },
                order: ['idTurma'],
                attributes: {
                    exclude: ['idDisciplina', 'idProfessor', 'idSala'],
                },
                include: [
                    {
                        model: Disciplina,
                        as: 'disciplina',
                    },
                    {
                        model: Professor,
                        as: 'professor',
                    },
                    {
                        model: Sala,
                        as: 'sala',
                    }
                ],
            });

            return res.json(turma);
        } else if (mostrar === 'todos') {
            const turma = await Turma.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { diaSemana: { [Op.iLike]: `%${filtro}%` } },
                    ],
                },
                order: ['idTurma'],
                attributes: {
                    exclude: ['idDisciplina', 'idProfessor', 'idSala'],
                },
                include: [
                    {
                        model: Disciplina,
                        as: 'disciplina',
                    },
                    {
                        model: Professor,
                        as: 'professor',
                    },
                    {
                        model: Sala,
                        as: 'sala',
                    },
                    {
                        model: Aluno,
                        as: 'alunos',
                        through: { 
                            attributes: [],
                        },
                        required: false,
                    }
                ],
            });

            return res.json(turma);
        } else {
            return res
                .status(400)
                .json({ error: 'Mostrar deve ser "ativo", "inativo" ou "todos"' });
        }
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /turma/actives');

        const turma = await Turma.findAll({
            where: {
                status: 'ativo',
            },
            order: ['idTurma'],
            attributes: {
                exclude: ['idDisciplina', 'idProfessor', 'idSala'],
            },
            include: [
                {
                    model: Disciplina,
                    as: 'disciplina',
                },
                {
                    model: Professor,
                    as: 'professor',
                },
                {
                    model: Sala,
                    as: 'sala',
                },
                {
                    model: Aluno,
                    as: 'alunos',
                    where: {
                        status: 'ativo',
                    },
                    through: { 
                        where: { status: 'ativo' },
                        attributes: [],
                    },
                    required: false,
                }
            ],
        });

        return res.json(turma);
    }

    async showInactives(req, res) {
        console.log('Recebendo requisição GET em /turma/inactives');

        const turma = await Turma.findAll({
            where: {
                status: 'inativo',
            },
            order: ['idTurma'],
            attributes: {
                exclude: ['idDisciplina', 'idProfessor', 'idSala'],
            },
            include: [
                {
                    model: Disciplina,
                    as: 'disciplina',
                },
                {
                    model: Professor,
                    as: 'professor',
                },
                {
                    model: Sala,
                    as: 'sala',
                },
            ],
        });

        return res.json(turma);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /turma/update/:id');

        const { id } = req.params;
        const {
            nome,
            diaSemana,
            horarioInicio,
            horarioTermino,
            idSala,
            idDisciplina,
            idProfessor,
        } = req.body;

        if (
            !nome ||
            !diaSemana ||
            !horarioInicio ||
            !horarioTermino ||
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
        turma.diaSemana = diaSemana;
        turma.horarioInicio = horarioInicio;
        turma.horarioTermino = horarioTermino;
        turma.idSala = idSala;
        turma.idDisciplina = idDisciplina;
        turma.idProfessor = idProfessor;

        await turma.save();

        return res.json(turma);
    }

    async activate(req, res) {
        console.log('Recebendo requisição PUT em /turma/activate/:id');

        const { id } = req.params;
        
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

    async showTurmasWithAluno(req, res) {
        console.log('Recebendo requisição GET em /turma/withAluno/:id');

        const { id: idAluno } = req.params;
        const { filtro } = req.query;

        const aluno = await Aluno.findByPk(idAluno);

        if (!aluno) {
            return res.status(400).json({ error: 'Aluno não encontrado' });
        }

        const turmasComAluno = await AlunoHasTurma.findAll({
            where: {
                idAluno,
                status: 'ativo',
            }
        });

        const idsTurma = turmasComAluno.map((turma) => turma.idTurma);

        if (!filtro) {
            const turmas = await Turma.findAll({
                where: {
                    status: 'ativo',
                    idTurma: {
                        [Op.in]: idsTurma,
                    },
                },
                order: ['idTurma'],
                attributes: {
                    exclude: ['idDisciplina', 'idProfessor', 'idSala'],
                },
                include: [
                    {
                        model: Disciplina,
                        as: 'disciplina',
                    },
                    {
                        model: Professor,
                        as: 'professor',
                    },
                    {
                        model: Sala,
                        as: 'sala',
                    },
                ],
            });

            return res.json(turmas);
        }

        const turmas = await Turma.findAll({
            where: {
                status: 'ativo',
                idTurma: {
                    [Op.in]: idsTurma,
                },
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${filtro}%` } },
                    { diaSemana: { [Op.iLike]: `%${filtro}%` } },
                ],
            },
            order: ['idTurma'],
            attributes: {
                exclude: ['idDisciplina', 'idProfessor', 'idSala'],
            },
            include: [
                {
                    model: Disciplina,
                    as: 'disciplina',
                },
                {
                    model: Professor,
                    as: 'professor',
                },
                {
                    model: Sala,
                    as: 'sala',
                },
            ],
        });

        return res.json(turmas);
    }


    async showTurmasWithoutAluno(req, res) {
        console.log('Recebendo requisição GET em /turma/withoutAluno/:id');

        const { id: idAluno } = req.params;
        const { filtro } = req.query;

        const aluno = await Aluno.findByPk(idAluno);

        if (!aluno) {
            return res.status(400).json({ error: 'Aluno não encontrado' });
        }

        const turmasSemAluno = await AlunoHasTurma.findAll({
            where: {
                idAluno,
                status: 'ativo',
            }
        });
        
        const idsTurma = turmasSemAluno.map((turma) => turma.idTurma);

        if(!filtro) {
            const turmas = await Turma.findAll({
                where: {
                    status: 'ativo',
                    idTurma: {
                        [Op.notIn]: idsTurma,
                    },
                },
                order: ['idTurma'],
                attributes: {
                    exclude: ['idDisciplina', 'idProfessor', 'idSala'],
                },
                include: [
                    {
                        model: Disciplina,
                        as: 'disciplina',
                    },
                    {
                        model: Professor,
                        as: 'professor',
                    },
                    {
                        model: Sala,
                        as: 'sala',
                    },
                ],
            });

            return res.json(turmas);
        }

        const turmas = await Turma.findAll({
            where: {
                status: 'ativo',
                idTurma: {
                    [Op.notIn]: idsTurma,
                },
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${filtro}%` } },
                    { diaSemana: { [Op.iLike]: `%${filtro}%` } },
                ],
            },
            order: ['idTurma'],
            attributes: {
                exclude: ['idDisciplina', 'idProfessor', 'idSala'],
            },
            include: [
                {
                    model: Disciplina,
                    as: 'disciplina',
                },
                {
                    model: Professor,
                    as: 'professor',
                },
                {
                    model: Sala,
                    as: 'sala',
                },
            ],
        });        

        return res.json(turmas);
    }
}

export default new ControllerTurma();
