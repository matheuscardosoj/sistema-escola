import { Router } from 'express';
import ControllerAluno from '../controllers/aluno.js';

const routerAluno = Router();

routerAluno.get('/actives', ControllerAluno.showActives);
routerAluno.put('/activate/:id', ControllerAluno.activate);
routerAluno.put('/disable/:id', ControllerAluno.disable);
routerAluno.get('/', ControllerAluno.index);
routerAluno.post('/', ControllerAluno.store);
routerAluno.get('/:id', ControllerAluno.show);
routerAluno.put('/:id', ControllerAluno.update);

export default routerAluno;
