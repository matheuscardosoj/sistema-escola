import express from "express";
import cors from 'cors';
import "dotenv/config.js";

const port = process.env.SERVER_PORT || 5050;
const hostname = process.env.SERVER_HOSTNAME || 'localhost';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, hostname, () => console.log(`Servidor rodando em: http://${hostname}:${port}`));
