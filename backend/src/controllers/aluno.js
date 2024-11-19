import Aluno from '../models/aluno.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';
import Turma from '../models/turma.js';

class ControllerAluno {
    async store(req, res) {
        console.log('Recebendo requisição POST em /aluno/create');

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
        console.log('Recebendo requisição GET em /aluno');

        const alunos = await Aluno.findAll(
            {
                order: ['idAluno'],
                include: {
                    model: Turma,
                    as: 'turmas',
                    through: { attributes: [] },
                    required: false,
                },
            }
        );

        return res.json(alunos);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /aluno/:id');

        const { id } = req.params;
        const aluno = await Aluno.findByPk(id, {
            order: ['idAluno'],
            include: {
                model: Turma,
                as: 'turmas',
                through: { attributes: [] },
                required: false,
            },
        });

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        return res.json(aluno);
    }

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrar } = req.body;

        if (!filtro || !mostrar) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        if (mostrar === 'ativo') {
            const alunos = await Aluno.findAll({
                where: {
                    status: 'ativo',
                    [Op.or]: [
                        {
                            nome: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            cpf: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            endereco: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            telefone: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        }
                    ],
                },
                order: ['idAluno'],
                include: {
                    model: Turma,
                    as: 'turmas',
                    where: {
                        status: 'ativo',
                    },
                    through: {
                        where: { status: 'ativo' },
                        attributes: [],                        
                    },
                    required: false,
                },
            });

            return res.json(alunos);
        } else if (mostrar === 'inativo') {
            const alunos = await Aluno.findAll({
                where: {
                    status: 'inativo',
                    [Op.or]: [
                        {
                            nome: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            cpf: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            endereco: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            telefone: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        }
                    ],
                },
                order: ['idAluno'],
            });

            return res.json(alunos);
        } else if (mostrar === 'todos') {
            const alunos = await Aluno.findAll({
                where: {
                    [Op.or]: [
                        {
                            nome: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            cpf: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            endereco: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        },
                        {
                            telefone: {
                                [Op.iLike]: `%${filtro}%`,
                            },
                        }
                    ],
                },
                order: ['idAluno'],
                include: {
                    model: Turma,
                    as: 'turmas',
                    through: { attributes: [] },
                    required: false,
                },
            });

            return res.json(alunos);
        } else {
            return res.status(400).json({ error: 'Mostrar deve ser "ativo", "inativo" ou "todos"' });
        }
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /aluno/actives');

        const alunos = await Aluno.findAll({
            where: {
                status: 'ativo',
            },
            order: ['idAluno'],
            include: {
                model: Turma,
                as: 'turmas',
                where: {
                    status: 'ativo',
                },
                through: {
                    where: { status: 'ativo' },
                    attributes: [],
                },
                required: false,
            },
        });

        return res.json(alunos);
    }

    async showInactives(req, res) {
        console.log('Recebendo requisição GET em /aluno/inactives');

        const alunos = await Aluno.findAll({
            where: {
                status: 'inativo',
            },
            order: ['idAluno'],
        });

        return res.json(alunos);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /aluno/update/:id');

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
        console.log('Recebendo requisição PUT em /aluno/activate/:id');

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
        console.log('Recebendo requisição PUT em /aluno/disable/:id');

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

        if (alunoHasTurmas && alunoHasTurmas.length > 0) {
            for(let alunoHasTurma of alunoHasTurmas) {
                alunoHasTurma.status = 'inativo';
                await alunoHasTurma.save();
            }
        }

        return res.json(aluno);
    }

    async linkAlunoTurma(req, res) {
        console.log('Recebendo requisição POST em /aluno/link');

        const { idAluno, idTurma } = req.body;

        const alunoExists = await Aluno.findByPk(idAluno);

        if (!alunoExists) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        if (alunoExists.status === 'inativo') {
            return res.status(400).json({ error: 'Aluno inativo' });
        }

        const turmaExists = await Turma.findByPk(idTurma);
        
        if (!turmaExists) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        if (turmaExists.status === 'inativo') {
            return res.status(400).json({ error: 'Turma inativa' });
        }

        const alunoHasTurmaExists = await AlunoHasTurma.findOne({
            where: {
                idAluno,
                idTurma,
            },
        });
    
        if (alunoHasTurmaExists) {
            if (alunoHasTurmaExists.status === 'inativo') {
                alunoHasTurmaExists.status = 'ativo';
                await alunoHasTurmaExists.save();
    
                return res.json(alunoHasTurmaExists);
            }

            return res.status(400).json({ error: 'Aluno já vinculado a esta turma' });
        }
    
        const alunoHasTurma = await AlunoHasTurma.create({
            idAluno,
            idTurma,
        });
    
        return res.json(alunoHasTurma);
    }

    async unlinkAlunoTurma(req, res) {
        console.log('Recebendo requisição POST em /aluno/unlink');

        const { idAluno, idTurma } = req.body;

        const alunoExists = await Aluno.findByPk(idAluno);

        if (!alunoExists) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        if (alunoExists.status === 'inativo') {
            return res.status(400).json({ error: 'Aluno inativo' });
        }

        const turmaExists = await Turma.findByPk(idTurma);

        if (!turmaExists) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        if (turmaExists.status === 'inativo') {
            return res.status(400).json({ error: 'Turma inativa' });
        }

        const alunoHasTurma = await AlunoHasTurma.findOne({
            where: {
                idAluno,
                idTurma,
            },
        });

        if (!alunoHasTurma) {
            return res.status(404).json({ error: 'Vínculo não encontrado' });
        }

        if (alunoHasTurma.status === 'inativo') {
            return res.status(400).json({ error: 'Vínculo já desfeito' });
        } 
        
        alunoHasTurma.status = 'inativo';
        await alunoHasTurma.save();

        return res.json(alunoHasTurma);
    }
}

export default new ControllerAluno();
