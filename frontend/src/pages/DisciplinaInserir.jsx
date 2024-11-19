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

    function handleInputChange(e) {
        const { id, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value
        }));
    };

    function clearInputsAndFocusFirst() {
        setFormValues({
            nome: "",
            codigo: "",
            periodo: "",
            descricao: ""
        });

        inputRefs.nome.current.focus();
    }

    function validaInputs(nome, codigo, periodo, descricao) {
        let mensagens = [];
        let valido = true;

        nome = String(nome);
        codigo = String(codigo);
        periodo = String(periodo);
        descricao = String(descricao);

        if (nome.trim() === "" || codigo.trim() === "" || periodo.trim() === "" || descricao.trim() === "") {
            mensagens.push("Preencha todos os campos.");
            valido = false;
        }

        if(nome.length < 3) {
            mensagens.push("O nome deve ter no mínimo 3 caracteres.");
            valido = false;
        }

        if(codigo.length < 3) {
            mensagens.push("O código deve ter no mínimo 3 caracteres.");
            valido = false;
        }

        if (isNaN(periodo) || parseInt(periodo) < 1) {
            mensagens.push("Período inválido.");
            valido = false;
        }

        if(descricao.length < 5) {
            mensagens.push("A descrição deve ter no mínimo 5 caracteres.");
            valido = false;
        }
        
        return { valido, mensagens };
    }

    async function handleEnviarClick() {
        try {
            const { nome, codigo, periodo, descricao } = formValues;

            const { valido, mensagens } = validaInputs(nome, codigo, periodo, descricao);

            if (!valido) {
                insertMensagem(refMensagem, mensagens, false);
                return;
            }

            const response = await apiDisciplina.criarDisciplina(nome, codigo, periodo, descricao);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao inserir disciplina:", error);
                insertMensagem(refMensagem, "Erro ao inserir disciplina.", false);
                
                return;
            }

            insertMensagem(refMensagem, "Disciplina inserida com sucesso.", true);
            clearInputsAndFocusFirst();
        } catch (error) {
            console.error("Erro ao inserir disciplina:", error);
            insertMensagem(refMensagem, "Erro ao inserir disciplina.", false);
        }
    }

    return (
        <Inserir
            titulo="Inserir Disciplina"
            buttonVoltar={<Link to="/disciplina" className="buttonVoltar button">Voltar</Link>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} value={formValues.nome} onChange={handleInputChange} autoFocus />
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
            divMensagem={<div className="mensagem mensagem--hidden" ref={refMensagem}></div>}
        />
    );
}

export default DisciplinaInserir;
