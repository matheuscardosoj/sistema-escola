/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { insertMensagem, insertMensagemWithNavigate, useDocumentTitle } from "../utils/helpers";
import Editar from "../components/Editar";
import ApiSala from "../api/ApiSala";
import { useEffect, useRef, useState } from "react";

const apiSala = new ApiSala();

function SalaEditar({ title }) {
    useDocumentTitle(title);

    const { id } = useParams();

    useEffect(() => {
        async function getSala() {
            try {
                const response = await apiSala.pegarSala(id);

                if (response.status !== 200) {
                    const { error } = await response.json();

                    setDisabled(true);

                    console.error("Erro ao buscar sala:", error);
                    insertMensagemWithNavigate(refMensagem, "Erro ao buscar sala.", false, "/sala");
                    return;
                }

                const sala = await response.json();

                setFormValues({
                    nome: sala.nome,
                    local: sala.local,
                    capacidade: sala.capacidade
                });

                setDisabled(false);
            } catch (error) {
                setDisabled(true);

                console.error("Erro ao buscar sala:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao buscar sala.", false, "/sala");
            }
        }

        getSala();
    }, []);

    const [disabled, setDisabled] = useState(true);
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

        setFormValues((prevValues) => {
            return {
                ...prevValues,
                [id]: value
            };
        });
    };

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
            const response = await apiSala.alterarSala(id, nome, local, capacidade);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao atualizar sala:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao atualizar sala.", false, "/sala");

                return;
            }

            insertMensagemWithNavigate(refMensagem, "Sala atualizada com sucesso.", true, "/sala");
        } catch (error) {
            console.error("Erro ao atualizar sala:", error);
            insertMensagemWithNavigate(refMensagem, "Erro ao atualizar sala.", false, "/sala");
        }

        setDisabled(true);
    }
    
    return (
        <Editar
            titulo={"Editar Sala"}
            buttonVoltar={<Link to="/sala" className="buttonVoltar button">Voltar</Link>}
            buttonEditar={<button className="button" id="buttonEnviar" onClick={handleEnviarClick} disabled={disabled}>Enviar</button>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} value={formValues.nome} onChange={handleInputChange} className="form__input" disabled={disabled}/>
                </div>,

                <div className="form__containerElement" key="local">
                    <label htmlFor="local">Local:</label>
                    <input type="text" id="local" ref={inputRefs.local} value={formValues.local} onChange={handleInputChange} className="form__input" disabled={disabled}/>
                </div>,

                <div className="form__containerElement" key="capacidade">
                    <label htmlFor="capacidade">Capacidade:</label>
                    <input type="number" id="capacidade" ref={inputRefs.capacidade} value={formValues.capacidade} onChange={handleInputChange} className="form__input" disabled={disabled}/>
                </div>
            ]}
            divMensagem={<div className="mensagem mensagem--hidden" ref={ refMensagem }></div>}
        />
    );
            
}

export default SalaEditar;
