/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { formataCPF, formataTelefone, insertMensagem, insertMensagemWithNavigate, removeMask, useDocumentTitle } from "../utils/helpers";
import Editar from "../components/Editar";
import ApiAluno from "../api/ApiAluno";
import { useEffect, useRef, useState } from "react";

const apiAluno = new ApiAluno();

function AlunoEditar({ title }) {
    useDocumentTitle(title);

    const { id } = useParams();

    useEffect(() => {
        async function getAluno() {
            try {
                const response = await apiAluno.pegarAluno(id);

                if (response.status !== 200) {
                    const { error } = await response.json();

                    setDisabled(true);

                    console.error("Erro ao buscar aluno:", error);
                    insertMensagemWithNavigate(refMensagem, "Erro ao buscar aluno.", false, "/aluno");

                    return;
                }

                const aluno = await response.json();
                
                setFormValues({
                    nome: aluno.nome,
                    cpf: formataCPF(aluno.cpf),
                    endereco: aluno.endereco,
                    telefone: formataTelefone(aluno.telefone)
                });

                setDisabled(false);
            } catch (error) {
                setDisabled(true);

                console.error("Erro ao buscar aluno:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao buscar aluno.", false, "/aluno");
            }
        }

        getAluno();
    }, []);

    const [disabled, setDisabled] = useState(true);
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
        const { nome, cpf, endereco, telefone } = formValues;
        const formattedCpf = removeMask(cpf);
        const formattedTelefone = removeMask(telefone);

        const { valido, mensagens } = validaInputs(nome, cpf, endereco, telefone);

        if (!valido) {
            insertMensagem(refMensagem, mensagens.join("<br>"), false);
            return;
        }

        try {
            const response = await apiAluno.alterarAluno(id, nome, formattedCpf, endereco, formattedTelefone);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao atualizar aluno:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao atualizar aluno.", false, "/aluno");

                return;
            }

            insertMensagemWithNavigate(refMensagem, "Aluno atualizado com sucesso.", true, "/aluno");
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            insertMensagemWithNavigate(refMensagem, "Erro ao atualizar aluno.", false, "/aluno");
        }

        setDisabled(true);
    }

    return (
        <Editar
            titulo="Editar Aluno"
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

export default AlunoEditar;
