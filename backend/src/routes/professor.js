import { Router } from 'express';
import ControllerProfessor from '../controllers/professor.js';

const routerProfessor = Router();

routerProfessor.get('/actives', ControllerProfessor.showActives);
routerProfessor.put('/activate/:id', ControllerProfessor.activate);
routerProfessor.put('/disable/:id', ControllerProfessor.disable);
routerProfessor.put('/update/:id', ControllerProfessor.update);
routerProfessor.post('/create', ControllerProfessor.store);
routerProfessor.post('/filter', ControllerProfessor.showFilter);
routerProfessor.get('/:id', ControllerProfessor.show);
routerProfessor.get('/', ControllerProfessor.index);

export default routerProfessor;
