/* eslint-disable react/prop-types */
import { Link,  Outlet } from 'react-router-dom';
import '../assets/styles/global.css';
import { useDocumentTitle } from '../utils/helpers';

function Home({ title }) {
    useDocumentTitle(title);

    return (
        <div className='container--flexivel'>
            <h1 className="titulo">Gerenciamento de Escola</h1>

            <div className="buttons">
                <Link className="button" to="/disciplina">Gerenciamento da disciplina</Link>
                <Link className="button" to="/professor">Gerenciamento do professor</Link>
                <Link className="button" to="/sala">Gerenciamento da sala</Link>
                <Link className="button" to="/turma">Gerenciamento da turma</Link>
                <Link className="button" to="/aluno">Gerenciamento do aluno</Link>
            </div>

            <Outlet />
        </div>
    );
};

export default Home;