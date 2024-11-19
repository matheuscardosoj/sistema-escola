/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import ApiSala from '../api/ApiSala';
import '../assets/styles/global.css';
import Inserir from '../components/Inserir';
import { useRef, useState } from 'react';
import { insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiSala = new ApiSala();

function SalaInserir({ title }) {
    useDocumentTitle(title);

    const refMensagem = useRef(null);
    const inputRefs = {
        nome: useRef(null),
        local: useRef(null),
        capacidade: useRef(null)
    };
    const [formValues, setFormValues] = useState({
        nome: "",
        local: "",
        capacidade: ""
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
            local: "",
            capacidade: ""
        });

        inputRefs.nome.current.focus();
    }

    function validaInputs(nome, local, capacidade) {
        let mensagens = [];
        let valido = true;

        nome = String(nome);
        local = String(local);
        capacidade = String(capacidade);

        if (nome.trim() === "" || local.trim() === "" || capacidade.trim() === "") {
            mensagens.push("Preencha todos os campos.");
            valido = false;
        }

        if(nome.length < 3) {
            mensagens.push("O nome deve ter no mínimo 3 caracteres.");
            valido = false;
        }

        if (local.length < 3) {
            mensagens.push("O local deve ter no mínimo 3 caracteres.");
            valido = false;
        }

        if (capacidade < 1) {
            mensagens.push("A capacidade deve ser maior que 0.");
            valido = false;
        }

        if (capacidade > 1000) {
            mensagens.push("A capacidade deve ser menor que 1000.");
            valido = false;
        }

        return { valido, mensagens };
    }

    async function handleEnviarClick() {
        const { nome, local, capacidade } = formValues;

        const { valido, mensagens } = validaInputs(nome, local, capacidade);

        if (!valido) {
            insertMensagem(refMensagem, mensagens, false);
            return;
        }

        try {
            const response = await apiSala.criarSala(nome, local, capacidade);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao inserir sala:", error);
                insertMensagem(refMensagem, "Erro ao inserir sala", false);

                return;
            }

            insertMensagem(refMensagem, ["Sala inserida com sucesso!"], true);
            clearInputsAndFocusFirst();
        } catch (error) {
            console.error("Erro ao inserir sala:", error);
            insertMensagem(refMensagem, "Erro ao inserir sala", false);
        }
    }

    return (
        <Inserir
            titulo={"Inserir Sala"}
            buttonVoltar={<Link to="/sala" className="buttonVoltar button">Voltar</Link>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} value={formValues.nome} onChange={handleInputChange} className="form__input" autoFocus />
                </div>,

                <div className="form__containerElement" key="local">
                    <label htmlFor="local">Local:</label>
                    <input type="text" id="local" ref={inputRefs.local} value={formValues.local} onChange={handleInputChange} className="form__input" />
                </div>,

                <div className="form__containerElement" key="capacidade">
                    <label htmlFor="capacidade">Capacidade:</label>
                    <input type="number" id="capacidade" ref={inputRefs.capacidade} value={formValues.capacidade} onChange={handleInputChange} className="form__input" />
                </div>
            ]}
            handleEnviarClick={handleEnviarClick}
            divMensagem={<div className="mensagem mensagem--hidden" ref={refMensagem}></div>}
        />
    );
}

export default SalaInserir;
