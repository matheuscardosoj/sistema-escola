import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Professor extends Model {}

Professor.init(
    {
        idProfessor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        endereco: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        telefone: {
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
        modelName: 'professores',
    },
);

export default Professor;
