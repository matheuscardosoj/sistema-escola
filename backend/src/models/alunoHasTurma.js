import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class AlunoHasTurma extends Model {}

AlunoHasTurma.init(
    {
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ativo',
        },

        idAluno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'alunos',
                key: 'idAluno',
            },
        },

        idTurma: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'turmas',
                key: 'idTurma',
            },
        },
    },
    {
        sequelize,
        modelName: 'aluno_has_turma',
        id: false,
    },
);

AlunoHasTurma.removeAttribute('id');

export default AlunoHasTurma;
