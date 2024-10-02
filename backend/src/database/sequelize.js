import { Sequelize, } from 'sequelize';
import configSequelize from '../config/sequelize.js';

const sequelize = new Sequelize(configSequelize);

export default sequelize;
