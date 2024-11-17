import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx';
import DisciplinaGerenciar from './pages/DisciplinaGerenciar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import DisciplinaInserir from './pages/DisciplinaInserir.jsx';
import DisciplinaMostrarInativos from './pages/DisciplinaMostrarInativos.jsx';
import DisciplinaEditar from './pages/DisciplinaEditar.jsx';
import ProfessorGerenciar from './pages/ProfessorGerenciar.jsx';
import NotFould from './pages/NotFould.jsx';
import ProfessorInserir from './pages/ProfessorInserir.jsx';
import ProfessorEditar from './pages/ProfessorEditar.jsx';
import ProfessorMostrarInativos from './pages/ProfessorMostrarInativos.jsx';
import SalaGerenciar from './pages/SalaGerenciar.jsx';
import SalaInserir from './pages/SalaInserir.jsx';
import SalaMostrarInativos from './pages/SalaMostrarInativos.jsx';
import SalaEditar from './pages/SalaEditar.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
          <Routes>
                <Route path="/" element={<Home title={'Home'} />} />
                <Route path="/disciplina" element={<DisciplinaGerenciar title={'Gerenciar Disciplinas'} />} />
                <Route path="/disciplina/inserir" element={<DisciplinaInserir title={'Inserir Disciplina'} />} />
                <Route path="/disciplina/inativos" element={<DisciplinaMostrarInativos title={'Disciplinas Inativas'} />} />
                <Route path='/disciplina/editar/:id' element={<DisciplinaEditar title={'Editar Disciplina'} />} />

                <Route path='/professor' element={<ProfessorGerenciar title={'Gerenciar Professores'} />} />
                <Route path='/professor/inserir' element={<ProfessorInserir title={'Inserir Professor'} />} />
                <Route path='professor/inativos' element={<ProfessorMostrarInativos title={'Professores Inativos'} />} />
                <Route path='professor/editar/:id' element={<ProfessorEditar title={'Editar Professor'} />} />

                <Route path='/sala' element={<SalaGerenciar title={'Gerenciar Salas'} />} />
                <Route path='/sala/inserir' element={<SalaInserir title={'Inserir Sala'} />} />
                <Route path='sala/inativos' element={<SalaMostrarInativos title={'Salas Inativas'} />} />
                <Route path='sala/editar/:id' element={<SalaEditar title={'Editar Sala'} />} />

                <Route path='*' element={<NotFould title={'404 Not Found'} />} />
            </Routes>
      </Router>
  </StrictMode>
);
