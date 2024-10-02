import { Router } from 'express';
import ControllerTurma from '../controllers/turma.js';

const routerTurma = Router();

routerTurma.get('/actives', ControllerTurma.showActives);
routerTurma.put('/enable/:id', ControllerTurma.enable);
routerTurma.put('/disable/:id', ControllerTurma.disable);
routerTurma.get('/', ControllerTurma.index);
routerTurma.post('/', ControllerTurma.store);
routerTurma.get('/:id', ControllerTurma.show);

export default routerTurma;
