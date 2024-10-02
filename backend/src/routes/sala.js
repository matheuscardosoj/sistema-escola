import { Router } from 'express';
import ControllerSala from '../controllers/sala.js';

const routerSala = Router();

routerSala.get('/actives', ControllerSala.showActives);
routerSala.put('/enable/:id', ControllerSala.enable);
routerSala.put('/disable/:id', ControllerSala.disable);
routerSala.get('/', ControllerSala.index);
routerSala.post('/', ControllerSala.store);
routerSala.get('/:id', ControllerSala.show);
routerSala.put('/:id', ControllerSala.update);

export default routerSala;
