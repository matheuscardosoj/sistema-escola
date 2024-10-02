import { Router } from 'express';
import ControllerDisciplina from '../controllers/disciplina.js';

const routerDisciplina = Router();

routerDisciplina.get('/actives', ControllerDisciplina.showActives);
routerDisciplina.put('/enable/:id', ControllerDisciplina.enable);
routerDisciplina.put('/disable/:id', ControllerDisciplina.disable);
routerDisciplina.get('/', ControllerDisciplina.index);
routerDisciplina.post('/', ControllerDisciplina.store);
routerDisciplina.get('/:id', ControllerDisciplina.show);
routerDisciplina.put('/:id', ControllerDisciplina.update);

export default routerDisciplina;
