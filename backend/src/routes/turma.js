import { Router } from 'express';
import ControllerTurma from '../controllers/turma.js';

const routerTurma = Router();

routerTurma.get('/actives', ControllerTurma.showActives);
routerTurma.put('/activate/:id', ControllerTurma.activate);
routerTurma.put('/disable/:id', ControllerTurma.disable);
routerTurma.put('/update/:id', ControllerTurma.update);
routerTurma.post('/create', ControllerTurma.store);
routerTurma.post('/filter', ControllerTurma.showFilter);
routerTurma.get('/:id', ControllerTurma.show);
routerTurma.get('/', ControllerTurma.index);

export default routerTurma;
