import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Turma extends Model {}

Turma.init(
    {
        idTurma: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        diaSemana: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        horarioInicio: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        horarioTermino: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ativo',
        },

        idDisciplina: { type: DataTypes.INTEGER },

        idProfessor: { type: DataTypes.INTEGER },

        idSala: { type: DataTypes.INTEGER },
    },
    {
        sequelize,
        modelName: 'turmas',
    },
);

export default Turma;
