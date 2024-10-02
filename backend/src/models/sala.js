import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Sala extends Model {}

Sala.init(
    {
        idSala: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        capacidade: {
            type: DataTypes.INTEGER,
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
        modelName: 'salas',
    },
);

export default Sala;
