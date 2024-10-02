import { Router } from 'express';
import ControllerAlunoHasTurma from '../controllers/alunoHasTurma.js';

const routerAlunoHasTurma = Router();

routerAlunoHasTurma.get('/actives', ControllerAlunoHasTurma.showActives);
routerAlunoHasTurma.put('/enable/:id', ControllerAlunoHasTurma.enable);
routerAlunoHasTurma.put('/disable/:id', ControllerAlunoHasTurma.disable);
routerAlunoHasTurma.get('/', ControllerAlunoHasTurma.index);
routerAlunoHasTurma.post('/', ControllerAlunoHasTurma.store);
routerAlunoHasTurma.get('/:id', ControllerAlunoHasTurma.show);

export default routerAlunoHasTurma;
