import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';
import Disciplina from './Disciplina.js';
import Professores from './Professor.js';
import Salas from './Sala.js';

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

        semestreAno: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        horario: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ativo',
        },

        idDisciplina: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idProfessor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        idSala: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'turmas',
    },
);

Disciplina.hasMany(Turma, {
    foreignKey: 'idDisciplina',
});

Professores.hasMany(Turma, {
    foreignKey: 'idProfessor',
});

Salas.hasMany(Turma, {
    foreignKey: 'idSala',
});

export default Turma;
