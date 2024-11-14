/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import ApiDisciplina from "../api/ApiDisciplina";
import Gerenciar from '../components/Gerenciar';
import { useNavigate } from 'react-router-dom';
import { insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiDisciplina = new ApiDisciplina();

function DisciplinaGerenciar({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'codigo', label: 'Código' },
        { id: 'periodo', label: 'Período' },
        { id: 'descricao', label: 'Descrição' },
    ];
    const [disciplinas, setDisciplinas] = useState([]);
    const navigate = useNavigate();
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateDisciplinas();
        }

        fetchData();
    }, []);

    async function updateDisciplinas() {
        const response = await apiDisciplina.pegarDisciplinasAtivas();

        if (response.status !== 200) {
            const error = await response.json();
            console.error("Erro ao buscar disciplinas:", error);
            return;
        }

        const disciplinas = await response.json();
        setDisciplinas(disciplinas);
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateDisciplinas();
            return;
        }

        try {
            const response = await apiDisciplina.pegarDisciplinasFiltradas(pesquisa, 'ativo');
            const disciplinas = await response.json();

            setDisciplinas(disciplinas);
        } catch (error) {
            console.error("Erro ao buscar disciplinas filtradas:", error);
        }
    }

    function handleEditClick(id) {
        navigate(`/disciplina/editar/${id}`);
    }

    async function handleDisableClick(id) {
        try {
            const response = await apiDisciplina.desativarDisciplina(id);

            if (response.status !== 200) {
                console.error("Erro ao desativar disciplina:", response);
                insertMensagem(refMensagem, "Erro ao desativar disciplina", false);
                return;
            }

            await updateDisciplinas();
            insertMensagem(refMensagem, "Disciplina desativada com sucesso");
        } catch (error) {
            console.error("Erro ao desativar disciplina:", error);
            insertMensagem(refMensagem, "Erro ao desativar disciplina", false);
        }
    }

    function handleInsertClick() {
        navigate("/disciplina/inserir");
    }

    function handleShowInactiveClick() {
        navigate("/disciplina/inativos");
    }

    function getData() {
        return Array.isArray(disciplinas) ? disciplinas.map((diciplina) => {
            return {
                id: diciplina.idDisciplina,
                nome: diciplina.nome,
                codigo: diciplina.codigo,
                periodo: diciplina.periodo,
                descricao: diciplina.descricao,
            };
        }) : []
    }

    return (
        <>
            <Gerenciar
                titulo={"Gerenciar Disciplinas"}
                columns={columns}
                data={getData()}
                handleEditClick={handleEditClick}
                handleDisableClick={handleDisableClick}
                handleInsertClick={handleInsertClick}
                handleShowInactiveClick={handleShowInactiveClick}
                handlePesquisar={handlePesquisar}
                divMensagem={<div className="mensagem mensagem--hidden" ref={refMensagem}></div>}
            />
        </>
    );
}

export default DisciplinaGerenciar;
