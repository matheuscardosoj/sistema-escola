import { Router } from 'express';
import routesAluno from './aluno.js';
import routesAlunoHasTurma from './alunoHasTurma.js';
import routesDisciplina from './disciplina.js';
import routesProfessor from './professor.js';
import routesSala from './sala.js';
import routesTurma from './turma.js';

const routes = Router();

routes.use('/aluno', routesAluno);
routes.use('/alunoHasTurma', routesAlunoHasTurma);
routes.use('/disciplina', routesDisciplina);
routes.use('/professor', routesProfessor);
routes.use('/sala', routesSala);
routes.use('/turma', routesTurma);

export default routes;
