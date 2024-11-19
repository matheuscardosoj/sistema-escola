/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import ApiAluno from '../api/ApiAluno';
import '../assets/styles/global.css';
import Inserir from '../components/Inserir';
import { useRef, useState } from 'react';
import { formataCPF, insertMensagem, useDocumentTitle, removeMask, formataTelefone } from '../utils/helpers';

const apiAluno = new ApiAluno();

function AlunoInserir({ title }) {
    useDocumentTitle(title);

    const refMensagem = useRef(null);
    const inputRefs = {
        nome: useRef(null),
        cpf: useRef(null),
        endereco: useRef(null),
        telefone: useRef(null)
    };

    const [formValues, setFormValues] = useState({
        nome: "",
        cpf: "",
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
            endereco: "",
            telefone: ""
        });

        inputRefs.nome.current.focus();
    }

    function validaInputs(nome, cpf, endereco, telefone) {
        let mensagens = [];
        let valido = true;

        nome = String(nome);
        cpf = String(cpf);
        endereco = String(endereco);
        telefone = String(telefone);

        if (nome.trim() === "" || cpf.trim() === "" || endereco.trim() === "" || telefone.trim() === "") {
            mensagens.push("Preencha todos os campos.");
            valido = false;
        }

        if(nome.length < 3) {
            mensagens.push("O nome deve conter no mínimo 3 caracteres.");
            valido = false;
        }

        if (cpf.length < 11) {
            mensagens.push("O CPF deve conter 11 dígitos.");
            valido = false;
        }

        if (endereco.length < 5) {
            mensagens.push("O endereço deve conter no mínimo 5 caracteres.");
            valido = false;
        }

        if (telefone.length < 10) {
            mensagens.push("O telefone deve conter 10 ou 11 dígitos.");
            valido = false;
        }

        return { valido, mensagens };
    }

    async function handleEnviarClick() {
        try {
            const { nome, cpf, endereco, telefone } = formValues;
            const formattedCpf = removeMask(cpf);
            const formattedTelefone = removeMask(telefone);

            const { valido, mensagens } = validaInputs(nome, formattedCpf, endereco, formattedTelefone);

            if (!valido) {
                insertMensagem(refMensagem, mensagens, false);
                return;
            }

            const response = await apiAluno.criarAluno(nome, formattedCpf, endereco, formattedTelefone);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao inserir aluno:", error);
                insertMensagem(refMensagem, "Erro ao inserir aluno.", false);

                return;
            }

            insertMensagem(refMensagem, "Aluno inserido com sucesso.", true);
            clearInputsAndFocusFirst();
        } catch (error) {
            console.error("Erro ao inserir aluno:", error);
            insertMensagem(refMensagem, "Erro ao inserir aluno.", false);
        }
    }

    return (
        <Inserir
            titulo="Inserir Aluno"
            buttonVoltar={<Link to="/aluno" className="buttonVoltar button">Voltar</Link>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} onChange={handleInputChange} value={formValues.nome} autoFocus/>
                </div>,

                <div className="form__containerElement" key="cpf">
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" ref={inputRefs.cpf} onChange={handleInputChange} value={formValues.cpf}/>
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
            divMensagem={<div className='mensagem mensagem--hidden' ref={refMensagem}></div>}
        >
        </Inserir>
    );
}

export default AlunoInserir;
