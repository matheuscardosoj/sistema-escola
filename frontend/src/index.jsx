import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx';
import DisciplinaGerenciar from './pages/DisciplinaGerenciar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import DisciplinaInserir from './pages/DisciplinaInserir.jsx';
import DisciplinaMostrarInativos from './pages/DisciplinaMostrarInativos.jsx';
import DisciplinaEditar from './pages/DisciplinaEditar.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
          <Routes>
                <Route path="/" element={<Home title={'Home'} />} />
                <Route path="/disciplina" element={<DisciplinaGerenciar title={'Gerenciar Disciplinas'} />} />
                <Route path="/disciplina/inserir" element={<DisciplinaInserir title={'Inserir Disciplina'} />} />
                <Route path="/disciplina/inativos" element={<DisciplinaMostrarInativos title={'Disciplinas Inativas'} />} />
                <Route path='/disciplina/editar/:id' element={<DisciplinaEditar title={'Editar Disciplina'} />} />
            </Routes>
      </Router>
  </StrictMode>
);
