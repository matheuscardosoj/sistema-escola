import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import sequelize from './src/database/sequelize.js';
import routes from './src/routes/routes.js';

const port = process.env.SERVER_PORT || 5050;
const hostname = process.env.SERVER_HOSTNAME || 'localhost';

const app = express();

sequelize.sync();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(port, hostname, () => {
    console.log(`Servidor rodando em: http://${hostname}:${port}`);
});
