/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import ApiDisciplina from '../api/ApiDisciplina';
import '../assets/styles/global.css';
import Inserir from '../components/Inserir';
import { useRef, useState } from 'react';
import { insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiDisciplina = new ApiDisciplina();

function DisciplinaInserir({ title }) {
    useDocumentTitle(title);

    const refMensagem = useRef(null);
    const inputRefs = {
        nome: useRef(null),
        codigo: useRef(null),
        periodo: useRef(null),
        descricao: useRef(null)
    };
    const [formValues, setFormValues] = useState({
        nome: "",
        codigo: "",
        periodo: "",
        descricao: ""
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value
        }));
    };

    async function handleEnviarClick(formValues) {
        try {
            const { nome, codigo, periodo, descricao } = formValues;
            const response = await apiDisciplina.criarDisciplina(nome, codigo, periodo, descricao);

            if (response.status !== 200) {
                const error = await response.json();
                console.error("Erro ao inserir disciplina:", error);
                insertMensagem(refMensagem, "Erro ao inserir disciplina.", false);
                return;
            }

            insertMensagem(refMensagem, "Disciplina inserida com sucesso.", true);
        } catch (error) {
            console.error("Erro ao inserir disciplina:", error);
            insertMensagem(refMensagem, "Erro ao inserir disciplina.", false);
        }
    };

    return (
        <>
            <Inserir
                titulo="Inserir Disciplina"
                buttonVoltar={<Link to="/disciplina" className="buttonVoltar button">Voltar</Link>}
                inputs={[
                    <div className="form__containerElement" key="nome">
                        <label htmlFor="nome">Nome:</label>
                        <input type="text" id="nome" ref={inputRefs.nome} value={formValues.nome} onChange={handleInputChange} />
                    </div>,

                    <div className="form__containerElement" key="codigo">
                        <label htmlFor="codigo">Código:</label>
                        <input type="text" id="codigo" ref={inputRefs.codigo} value={formValues.codigo} onChange={handleInputChange} />
                    </div>,

                    <div className="form__containerElement" key="periodo">
                        <label htmlFor="periodo">Período:</label>
                        <input type="number" id="periodo" ref={inputRefs.periodo} value={formValues.periodo} onChange={handleInputChange} />
                    </div>,

                    <div className="form__containerElement" key="descricao">
                        <label htmlFor="descricao">Descrição:</label>
                        <input type="text" id="descricao" ref={inputRefs.descricao} value={formValues.descricao} onChange={handleInputChange} />
                    </div>
                ]}
                handleEnviarClick={handleEnviarClick}
                divMensagem={<div className="mensagem mensagem--hidden" ref={ refMensagem }></div>}
            />
        </>
    );
}

export default DisciplinaInserir;
