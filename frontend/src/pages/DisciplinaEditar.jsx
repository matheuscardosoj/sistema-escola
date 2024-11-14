/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import { insertMensagem, insertMensagemWithNavigate, useDocumentTitle } from "../utils/helpers";
import Editar from "../components/Editar";
import ApiDisciplina from "../api/ApiDisciplina";
import { useEffect, useRef, useState } from "react";

const apiDisciplina = new ApiDisciplina();


function DisciplinaEditar({ title }) {
    useDocumentTitle(title);

    const { id } = useParams();

    useEffect(() => {
        async function getDisciplina() {
            try {
                const response = await apiDisciplina.pegarDisciplina(id);

                if (response.status !== 200) {
                    const error = await response.json();
                    console.error("Erro ao buscar disciplina:", error);
                    insertMensagemWithNavigate(refMensagem, "Erro ao buscar disciplina.", false, "/disciplina");
                    return;
                }

                const disciplina = await response.json();
                setFormValues({
                    nome: disciplina.nome,
                    codigo: disciplina.codigo,
                    periodo: disciplina.periodo,
                    descricao: disciplina.descricao
                });

                setDisabled(false);
            } catch (error) {
                console.error("Erro ao buscar disciplina:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao buscar disciplina.", false, "/disciplina");
            }
        }

        getDisciplina();
    }, []);

    const [disabled, setDisabled] = useState(true);
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

    async function handleEnviarClick() {
        try {
            const { nome, codigo, periodo, descricao } = formValues;
            
            const response = await apiDisciplina.alterarDisciplina(id, nome, codigo, periodo, descricao);

            if (response.status !== 200) {
                const error = await response.json();
                console.error("Erro ao inserir disciplina:", error);
                insertMensagem(refMensagem, "Erro ao editar disciplina.", false);
                return;
            }

            setDisabled(true);

            insertMensagemWithNavigate(refMensagem, "Disciplina editada com sucesso.", true, "/disciplina");
        } catch (error) {
            console.error("Erro ao inserir disciplina:", error);
            insertMensagem(refMensagem, "Erro ao editar disciplina.", false);
        }
    };

    return (
        <Editar 
            titulo="Editar Disciplina"
            buttonVoltar={<Link to="/disciplina" className="buttonVoltar button">Voltar</Link>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} value={formValues.nome} onChange={handleInputChange} disabled={disabled} />
                </div>,

                <div className="form__containerElement" key="codigo">
                    <label htmlFor="codigo">Código:</label>
                    <input type="text" id="codigo" ref={inputRefs.codigo} value={formValues.codigo} onChange={handleInputChange} disabled={disabled} />
                </div>,

                <div className="form__containerElement" key="periodo">
                    <label htmlFor="periodo">Período:</label>
                    <input type="number" id="periodo" ref={inputRefs.periodo} value={formValues.periodo} onChange={handleInputChange} disabled={disabled} />
                </div>,

                <div className="form__containerElement" key="descricao">
                    <label htmlFor="descricao">Descrição:</label>
                    <input type="text" id="descricao" ref={inputRefs.descricao} value={formValues.descricao} onChange={handleInputChange} disabled={disabled} />
                </div>
            ]}
            handleEnviarClick={handleEnviarClick}
            divMensagem={<div className="mensagem mensagem--hidden" ref={ refMensagem }></div>}
        />
    );
}

export default DisciplinaEditar;