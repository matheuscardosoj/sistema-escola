/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import ApiTurma from "../api/ApiTurma";
import Gerenciar from '../components/Gerenciar';
import { useNavigate } from 'react-router-dom';
import { insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiTurma = new ApiTurma();

function TurmaGerenciar({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'diaSemana', label: 'Dia da Semana' },
        { id: 'horarioInicio', label: 'Horario de Início' },
        { id: 'horarioTermino', label: 'Horario de Término' },
        { id: 'sala', label: 'Sala' },
        { id: 'disciplina', label: 'Disciplina' },
        { id: 'professor', label: 'Professor' },
        {id: 'alunos', label: 'Alunos' }
    ];

    const [turmas, setTurmas] = useState([]);
    const navigate = useNavigate();
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateTurmas();
        }

        fetchData();
    }, []);

    async function updateTurmas() {
        const response = await apiTurma.pegarTurmasAtivas();

        if (response.status !== 200) {
            const { error } = await response.json();

            console.error("Erro ao buscar turmas:", error);

            return;
        }

        const turmas = await response.json();
        setTurmas(turmas);
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateTurmas();
            return;
        }

        try {
            const response = await apiTurma.pegarTurmasFiltradas(pesquisa, 'ativo');

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar turmas filtradas:", error);
                insertMensagem(refMensagem, "Erro ao buscar turmas filtradas.", false);

                return;
            }

            const turmas = await response.json();

            setTurmas(turmas);
        } catch (error) {
            console.error("Erro ao buscar turmas filtradas:", error);
            insertMensagem(refMensagem, "Erro ao buscar turmas filtradas.", false);
        }
    }

    async function handleEditClick(id) {
        navigate(`/turma/editar/${id}`);
    }

    async function handleDisableClick(id) {
        try {
            const response = await apiTurma.desativarTurma(id);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao desativar turma:", error);
                insertMensagem(refMensagem, "Erro ao desativar turma.", false);

                return;
            }

            await updateTurmas();
            insertMensagem(refMensagem, "Turma desativada com sucesso.", true);
        } catch (error) {
            console.error("Erro ao desativar turma:", error);
            insertMensagem(refMensagem, "Erro ao desativar turma.", false);
        }
    }

    function handleInsertClick() {
        navigate('/turma/inserir');
    }

    function handleShowInactiveClick() {
        navigate('/turma/inativos');
    }

    function getData() {
        return Array.isArray(turmas) ? turmas.map((turma) => {
            return {
                id: turma.id,
                nome: turma.nome,
                diaSemana: turma.diaSemana,
                horarioInicio: turma.horarioInicio,
                horarioTermino: turma.horarioTermino,
                sala: turma.sala.nome,
                disciplina: turma.disciplina.nome,
                professor: turma.professor.nome,
                alunos: turma.alunos.map((aluno) => aluno.nome).join(', ')
            };
        }) : [];
    }

    return (
        <Gerenciar
            titulo={"Gerenciar Turmas"}
            columns={columns}
            data={getData()}
            handleEditClick={handleEditClick}
            handleDisableClick={handleDisableClick}
            handleInsertClick={handleInsertClick}
            handleShowInactiveClick={handleShowInactiveClick}
            handlePesquisar={handlePesquisar}
            divMensagem={<div className='mensagem mensagem--hidden' ref={refMensagem}></div>}
        />
    );
}

export default TurmaGerenciar;
