/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import ApiProfessor from '../api/ApiProfessor';
import '../assets/styles/global.css';
import Inserir from '../components/Inserir';
import { useRef, useState } from 'react';
import { formataCPF, insertMensagem, useDocumentTitle, removeMask, formataTelefone } from '../utils/helpers';

const apiProfessor = new ApiProfessor();

function ProfessorInserir({ title }) {
    useDocumentTitle(title);

    const refMensagem = useRef(null);
    const inputRefs = {
        nome: useRef(null),
        cpf: useRef(null),
        titulo: useRef(null),
        endereco: useRef(null),
        telefone: useRef(null)
    };

    const [formValues, setFormValues] = useState({
        nome: "",
        cpf: "",
        titulo: "",
        endereco: "",
        telefone: ""
    });

    function handleInputChange(e) {
        const { id, value } = e.target;

        setFormValues((prevValues) => {
            if (id === "cpf") {
                return {
                    ...prevValues,
                    [id]: formataCPF(value)
                };
            }

            if (id === "telefone") {
                return {
                    ...prevValues,
                    [id]: formataTelefone(value)
                };
            }

            return {
                ...prevValues,
                [id]: value
            };
        });
    };

    function clearInputsAndFocusFirst() {
        setFormValues({
            nome: "",
            cpf: "",
            titulo: "",
            endereco: "",
            telefone: ""
        });

        inputRefs.nome.current.focus();
    }

    function validaInputs(nome, cpf, titulo, endereco, telefone) {
        let mensagens = [];
        let valido = true;

        nome = String(nome);
        cpf = String(cpf);
        titulo = String(titulo);
        endereco = String(endereco);
        telefone = String(telefone);

        if (nome.trim() === "" || cpf.trim() === "" || titulo.trim() === "" || endereco.trim() === "" || telefone.trim() === "") {
            mensagens.push("Todos os campos devem ser preenchidos.");
            valido = false;
        }

        if(nome.length < 3) {
            mensagens.push("O nome deve conter no mínimo 3 caracteres.");
            valido = false;
        }

        if (endereco.length < 5) {
            mensagens.push("O endereço deve conter no mínimo 5 caracteres.");
            valido = false;
        }

        if (cpf.length !== 11) {
            mensagens.push("O CPF deve conter 11 dígitos.");
            valido = false;
        }

        if (telefone.length < 10) {
            mensagens.push("O telefone deve conter no mínimo 10 dígitos.");
            valido = false;
        }

        return { valido, mensagens };
    }


    async function handleEnviarClick() {
        try {
            const { nome, cpf, titulo, endereco, telefone } = formValues;
            const formattedCpf = removeMask(cpf);
            const formattedTelefone = removeMask(telefone);

            const { valido, mensagens } = validaInputs(nome, formattedCpf, titulo, endereco, formattedTelefone);

            if (!valido) {
                insertMensagem(refMensagem, mensagens, false);
                return;
            }
            
            const response = await apiProfessor.criarProfessor(nome, formattedCpf, titulo, endereco, formattedTelefone);

            if (response.status !== 200) {
                const error = await response.json();
                console.error("Erro ao inserir professor:", error);
                insertMensagem(refMensagem, "Erro ao inserir professor.", false);
                return;
            }

            insertMensagem(refMensagem, "Professor inserido com sucesso.", true);
            clearInputsAndFocusFirst();
        } catch (error) {
            console.error("Erro ao inserir professor:", error);
            insertMensagem(refMensagem, "Erro ao inserir professor.", false);
        }
    }

    return (
        <Inserir
            titulo="Inserir Professor"
            buttonVoltar={<Link to="/professor" className="buttonVoltar button">Voltar</Link>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} onChange={handleInputChange} value={formValues.nome}/>
                </div>,

                <div className="form__containerElement" key="cpf">
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" ref={inputRefs.cpf} onChange={handleInputChange} value={formValues.cpf}/>
                </div>,

                <div className="form__containerElement" key="titulo">
                    <label htmlFor="titulo">Título:</label>
                    <input type="text" id="titulo" ref={inputRefs.titulo} onChange={handleInputChange} value={formValues.titulo}/>
                </div>,

                <div className="form__containerElement" key="endereco">
                    <label htmlFor="endereco">Endereço:</label>
                    <input type="text" id="endereco" ref={inputRefs.endereco} onChange={handleInputChange} value={formValues.endereco}/>
                </div>,

                <div className="form__containerElement" key="telefone">
                    <label htmlFor="telefone">Telefone:</label>
                    <input type="text" id="telefone" ref={inputRefs.telefone} onChange={handleInputChange} value={formValues.telefone}/>
                </div>
            ]}
            handleEnviarClick={handleEnviarClick}
            divMensagem={<div className="mensagem mensagem--hidden" ref={ refMensagem }></div>}
        />
    );
}

export default ProfessorInserir;
