import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Disciplina extends Model {}

Disciplina.init(
    {
        idDisciplina: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        codigo: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        periodo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ativo',
        },
    },

    {
        sequelize,
        modelName: 'disciplinas',
    },
);

export default Disciplina;
