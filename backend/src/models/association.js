import Turma from '../models/turma.js';
import Disciplina from '../models/disciplina.js';
import Professor from '../models/professor.js';
import Sala from '../models/sala.js';

Turma.belongsTo(Disciplina, { foreignKey: 'idDisciplina', as: 'disciplina'},);
Turma.belongsTo(Professor, { foreignKey: 'idProfessor', as: 'professor' });
Turma.belongsTo(Sala, { foreignKey: 'idSala', as: 'sala' });
