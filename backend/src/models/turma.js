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

        anoSemestre: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        horaInicio: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        horaTermino: {
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
