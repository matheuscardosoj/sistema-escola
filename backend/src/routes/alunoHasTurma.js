import { Router } from 'express';
import ControllerAlunoHasTurma from '../controllers/alunoHasTurma.js';

const routerAlunoHasTurma = Router();

routerAlunoHasTurma.get('/actives', ControllerAlunoHasTurma.showActives);
routerAlunoHasTurma.get('/inactives', ControllerAlunoHasTurma.showInactives);
routerAlunoHasTurma.put('/activate/', ControllerAlunoHasTurma.activate);
routerAlunoHasTurma.put('/disable/', ControllerAlunoHasTurma.disable);
routerAlunoHasTurma.post('/create', ControllerAlunoHasTurma.store);
routerAlunoHasTurma.post('/', ControllerAlunoHasTurma.show);
routerAlunoHasTurma.get('/', ControllerAlunoHasTurma.index);

export default routerAlunoHasTurma;
