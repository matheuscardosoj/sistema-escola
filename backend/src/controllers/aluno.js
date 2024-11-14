import Aluno from '../models/aluno.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

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
            }
        );

        return res.json(alunos);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /aluno/:id');

        const { id } = req.params;
        const aluno = await Aluno.findByPk(id, {
            order: ['idAluno'],
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
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            cpf: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            endereco: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            telefone: {
                                [Op.like]: `%${filtro}%`,
                            },
                        }
                    ],
                },
                order: ['idAluno'],
            });

            return res.json(alunos);
        } else if (mostrar === 'inativo') {
            const alunos = await Aluno.findAll({
                where: {
                    status: 'inativo',
                    [Op.or]: [
                        {
                            nome: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            cpf: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            endereco: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            telefone: {
                                [Op.like]: `%${filtro}%`,
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
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            cpf: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            endereco: {
                                [Op.like]: `%${filtro}%`,
                            },
                        },
                        {
                            telefone: {
                                [Op.like]: `%${filtro}%`,
                            },
                        }
                    ],
                },
                order: ['idAluno'],
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

        if (alunoHasTurmas) {
            alunoHasTurmas.forEach(async (alunoHasTurma) => {
                alunoHasTurma.status = 'inativo';
                await alunoHasTurma.save();
            });
        }

        return res.json(aluno);
    }
}

export default new ControllerAluno();
