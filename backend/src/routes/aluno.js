import { Router } from 'express';
import ControllerAluno from '../controllers/aluno.js';

const routerAluno = Router();

routerAluno.get('/actives', ControllerAluno.showActives);
routerAluno.put('/activate/:id', ControllerAluno.activate);
routerAluno.put('/disable/:id', ControllerAluno.disable);
routerAluno.put('/update/:id', ControllerAluno.update);
routerAluno.post('/create', ControllerAluno.store);
routerAluno.post('/filter', ControllerAluno.showFilter);
routerAluno.get('/:id', ControllerAluno.show);
routerAluno.get('/', ControllerAluno.index);

export default routerAluno;
