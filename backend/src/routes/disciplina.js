import { Router } from 'express';
import ControllerDisciplina from '../controllers/disciplina.js';

const routerDisciplina = Router();

routerDisciplina.get('/actives', ControllerDisciplina.showActives);
routerDisciplina.put('/activate/:id', ControllerDisciplina.activate);
routerDisciplina.put('/disable/:id', ControllerDisciplina.disable);
routerDisciplina.put('/update/:id', ControllerDisciplina.update);
routerDisciplina.post('/create', ControllerDisciplina.store);
routerDisciplina.get('/:id', ControllerDisciplina.show);
routerDisciplina.get('/', ControllerDisciplina.index);

export default routerDisciplina;
