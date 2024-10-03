import { Router } from 'express';
import ControllerSala from '../controllers/sala.js';

const routerSala = Router();

routerSala.get('/actives', ControllerSala.showActives);
routerSala.put('/activate/:id', ControllerSala.activate);
routerSala.put('/disable/:id', ControllerSala.disable);
routerSala.put('/update/:id', ControllerSala.update);
routerSala.post('/create', ControllerSala.store);
routerSala.get('/:id', ControllerSala.show);
routerSala.get('/', ControllerSala.index);

export default routerSala;
