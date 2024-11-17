/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { formataCPF, formataTelefone, insertMensagem, insertMensagemWithNavigate, removeMask, useDocumentTitle } from "../utils/helpers";
import Editar from "../components/Editar";
import ApiProfessor from "../api/ApiProfessor";
import { useEffect, useRef, useState } from "react";

const apiProfessor = new ApiProfessor();

function ProfessorEditar({ title }) {
    useDocumentTitle(title);

    const { id } = useParams();

    useEffect(() => {
        async function getProfessor() {
            try {
                const response = await apiProfessor.pegarProfessor(id);

                if (response.status !== 200) {
                    const { error } = await response.json();

                    setDisabled(true);

                    console.error("Erro ao buscar professor:", error);
                    insertMensagemWithNavigate(refMensagem, "Erro ao buscar professor.", false, "/professor");
                    return;
                }

                const professor = await response.json();
                
                setFormValues({
                    nome: professor.nome,
                    cpf: formataCPF(professor.cpf),
                    titulo: professor.titulo,
                    endereco: professor.endereco,
                    telefone: formataTelefone(professor.telefone)
                });

                setDisabled(false);
            } catch (error) {
                setDisabled(true);

                console.error("Erro ao buscar professor:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao buscar professor.", false, "/professor");
            }
        }

        getProfessor();
    }, []);

    const [disabled, setDisabled] = useState(true);
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
        const { nome, cpf, titulo, endereco, telefone } = formValues;
        const formattedCpf = removeMask(cpf);
        const formattedTelefone = removeMask(telefone);

        const { valido, mensagens } = validaInputs(nome, formattedCpf, titulo, endereco, formattedTelefone);

        if (!valido) {
            insertMensagem(refMensagem, mensagens, false);
            return;
        }

        try {
            const response = await apiProfessor.alterarProfessor(id, nome, cpf, titulo, endereco, telefone);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao atualizar professor:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao atualizar professor.", false, "/professor");

                return;
            }

            insertMensagemWithNavigate(refMensagem, "Professor atualizado com sucesso.", true, "/professor");
        } catch (error) {
            console.error("Erro ao atualizar professor:", error);
            insertMensagemWithNavigate(refMensagem, "Erro ao atualizar professor.", false, "/professor");
        }

        setDisabled(true);
    }


    return (
        <Editar
            titulo="Editar Professor"
            buttonVoltar={<Link to="/professor" className="buttonVoltar button">Voltar</Link>}
            buttonEditar={<button className="button" id="buttonEnviar" onClick={handleEnviarClick} disabled={disabled}>Enviar</button>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} onChange={handleInputChange} value={formValues.nome} disabled={disabled}/>
                </div>,

                <div className="form__containerElement" key="cpf">
                    <label htmlFor="cpf">CPF:</label>
                    <input type="text" id="cpf" ref={inputRefs.cpf} onChange={handleInputChange} value={formValues.cpf} disabled={disabled}/>
                </div>,

                <div className="form__containerElement" key="titulo">
                    <label htmlFor="titulo">Título:</label>
                    <input type="text" id="titulo" ref={inputRefs.titulo} onChange={handleInputChange} value={formValues.titulo} disabled={disabled}/>
                </div>,

                <div className="form__containerElement" key="endereco">
                    <label htmlFor="endereco">Endereço:</label>
                    <input type="text" id="endereco" ref={inputRefs.endereco} onChange={handleInputChange} value={formValues.endereco} disabled={disabled}/>
                </div>,

                <div className="form__containerElement" key="telefone">
                    <label htmlFor="telefone">Telefone:</label>
                    <input type="text" id="telefone" ref={inputRefs.telefone} onChange={handleInputChange} value={formValues.telefone} disabled={disabled}/>
                </div>
            ]}
            divMensagem={<div className="mensagem mensagem--hidden" ref={ refMensagem }></div>}
        />
    );
}

export default ProfessorEditar;
