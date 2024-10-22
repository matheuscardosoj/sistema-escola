import Professor from '../models/professor.js';
import Turma from '../models/turma.js';
import AlunoHasTurma from '../models/alunoHasTurma.js';
import { Op } from 'sequelize';

class ControllerProfessor {
    async store(req, res) {
        console.log('Recebendo requisição POST em /professor/create');

        const { nome, cpf, endereco, telefone } = req.body;

        if (!nome || !cpf || !endereco || !telefone) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const professor = await Professor.create({
            nome,
            cpf,
            endereco,
            telefone,
        });

        return res.json(professor);
    }

    async index(req, res) {
        console.log('Recebendo requisição GET em /professor');

        const professor = await Professor.findAll({
            order:['idProfessor']
        });

        return res.json(professor);
    }

    async show(req, res) {
        console.log('Recebendo requisição GET em /professor/:id');

        const { id } = req.params;
        const professor = await Professor.findByPk(id, {
            order:['idProfessor']
        });

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        return res.json(professor);
    }

    async showFilter(req, res) {
        console.log('Recebendo requisição POST em /disciplina/filter');

        const { filtro, mostrarInativas } = req.body;

        console.log(filtro, mostrarInativas);

        let professores;

        if(mostrarInativas === undefined) {
            res.status(400).json({ error: 'Preencha o campo mostrarInativas' });
        }

        if (!filtro) {
            if(mostrarInativas) {
                professores = await Professor.findAll({
                    order:['idProfessor']
                });
            } else {
                professores = await Professor.findAll({
                    where: {
                        status: 'ativo',
                    },
                    order:['idProfessor']
                });
            }

            return res.json(professores);
        }

        if(mostrarInativas) {
            professores = await Professor.findAll({
                where: {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${filtro}%` } },
                        { endereco: { [Op.iLike]: `%${filtro}%` } },
                    ]
                },
                order:['idProfessor']
            });

            return res.json(professores);
        }        

        professores = await Professor.findAll({
            where: {
                status: 'ativo',
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${filtro}%` } },
                    { endereco: { [Op.iLike]: `%${filtro}%` } },
                ]
            },
            order:['idProfessor']
        });

        return res.json(professores);
    }

    async showActives(req, res) {
        console.log('Recebendo requisição GET em /professor/actives');

        const professor = await Professor.findAll({
            where: {
                status: 'ativo',
            },
            order:['idProfessor']
        });

        return res.json(professor);
    }

    async update(req, res) {
        console.log('Recebendo requisição PUT em /professor/update/:id');

        const { id } = req.params;
        const { nome, cpf, endereco, telefone } = req.body;

        if (!nome || !cpf || !endereco || !telefone) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        const professor = await Professor.findByPk(id);

        console.log(req.body, id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        professor.nome = nome;
        professor.cpf = cpf;
        professor.endereco = endereco;
        professor.telefone = telefone;
        await professor.save();

        return res.json(professor);
    }

    async activate(req, res) {
        console.log('Recebendo requisição PUT em /professor/activate/:id');

        const { id } = req.params;
        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        professor.status = 'ativo';
        await professor.save();

        return res.json(professor);
    }

    async disable(req, res) {
        console.log('Recebendo requisição PUT em /professor/disable/:id');

        const { id } = req.params;
        const professor = await Professor.findByPk(id);

        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado.' });
        }

        professor.status = 'inativo';
        await professor.save();

        const turmas = await Turma.findAll({
            where: {
                idProfessor: professor.idProfessor,
            },
        });

        if (turmas) {
            turmas.forEach(async (turma) => {
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
            });
        }

        return res.json(professor);
    }
}

export default new ControllerProfessor();
