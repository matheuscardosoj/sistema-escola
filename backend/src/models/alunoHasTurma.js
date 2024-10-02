import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Aluno from '../models/aluno.js';
import Turma from '../models/turma.js';

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
            primaryKey: true,
        },

        idTurma: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'alunos_has_turmas',
        id: false,
    },
);

AlunoHasTurma.removeAttribute('id');

Aluno.belongsToMany(Turma, {
    through: AlunoHasTurma,
    foreignKey: 'idAluno',
});

Turma.belongsToMany(Aluno, {
    through: AlunoHasTurma,
    foreignKey: 'idTurma',
});

export default AlunoHasTurma;
