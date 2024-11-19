/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Mostrar from "../components/Mostrar";
import ApiDisciplina from "../api/ApiDisciplina";
import { useEffect, useRef, useState } from "react";
import { insertMensagem, useDocumentTitle } from "../utils/helpers";

const apiDisciplina = new ApiDisciplina();

function DisciplinaMostrarInativos({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'codigo', label: 'Código' },
        { id: 'periodo', label: 'Período' },
        { id: 'descricao', label: 'Descrição' },
    ];

    const [disciplinasInativas, setDisciplinasInativas] = useState([]);
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateDisciplinasInativas();
        }

        fetchData();
    }, []);

    async function updateDisciplinasInativas() {
        try {
            const response = await apiDisciplina.pegarDisciplinasInativas();
            
            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar disciplinas inativas:", error);
                insertMensagem(refMensagem, "Erro ao buscar disciplinas inativas.", false);
                setDisciplinasInativas([]);

                return;
            }

            const disciplinasInativas = await response.json();
            setDisciplinasInativas(disciplinasInativas);
        } catch (error) {
            console.error("Erro ao buscar disciplinas inativas:", error);
            insertMensagem("Erro ao buscar disciplinas inativas.", false);
            setDisciplinasInativas([]);
        }
    }

    function getData() {
        return Array.isArray(disciplinasInativas) ? disciplinasInativas.map(disciplina => {
            return {
                id: disciplina.idDisciplina,
                nome: disciplina.nome,
                codigo: disciplina.codigo,
                periodo: disciplina.periodo,
                descricao: disciplina.descricao,
            };
        }) : [];
    }

    async function handleEnableClick(id) {
        try {
            const response = await apiDisciplina.ativarDisciplina(id);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao ativar disciplina:", error);
                insertMensagem(refMensagem, "Erro ao ativar disciplina.", false);
                return;
            }

            await updateDisciplinasInativas();
            insertMensagem(refMensagem, "Disciplina ativada com sucesso.", true);
        } catch (error) {
            console.error("Erro ao ativar disciplina:", error);
            insertMensagem(refMensagem, "Erro ao ativar disciplina.", false);
        }
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateDisciplinasInativas();
            return;
        }

        try {
            const response = await apiDisciplina.pegarDisciplinasFiltradas(pesquisa, 'inativo');
            
            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar disciplinas filtradas:", error);
                insertMensagem(refMensagem, "Erro ao buscar disciplinas filtradas.", false);

                return;
            }

            setDisciplinasInativas(disciplinasInativas);
        } catch (error) {
            console.error("Erro ao buscar disciplinas filtradas:", error);
            insertMensagem(refMensagem, "Erro ao buscar disciplinas filtradas.", false);
        }
    }

    return (
        <Mostrar
            titulo="Mostrar disciplinas inativas"
            buttonVoltar={<Link to="/disciplina" className="buttonVoltar button">Voltar</Link>}
            columns={columns}
            data={getData()}
            buttons={[
                {
                    label: "Ativar",
                    onClick: handleEnableClick,
                },
            ]}
            handlePesquisar={handlePesquisar} 
            divMensagem={<div ref={ refMensagem } className="mensagem mensagem--hidden"></div>}
        />
    );
}

export default DisciplinaMostrarInativos;