import { Router } from 'express';
import ControllerProfessor from '../controllers/professor.js';

const routerProfessor = Router();

routerProfessor.get('/actives', ControllerProfessor.showActives);
routerProfessor.put('/enable/:id', ControllerProfessor.enable);
routerProfessor.put('/disable/:id', ControllerProfessor.disable);
routerProfessor.get('/', ControllerProfessor.index);
routerProfessor.post('/', ControllerProfessor.store);
routerProfessor.get('/:id', ControllerProfessor.show);

export default routerProfessor;
