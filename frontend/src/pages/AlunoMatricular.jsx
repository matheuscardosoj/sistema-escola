/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Link, useParams } from "react-router-dom";
import Mostrar from "../components/Mostrar";
import ApiAluno from "../api/ApiAluno";
import { useEffect, useRef, useState } from "react";
import { insertMensagem, useDocumentTitle } from "../utils/helpers";
import ApiTurma from "../api/ApiTurma";

const apiAluno = new ApiAluno();
const apiTurma = new ApiTurma();

function AlunoMatricular({ title }) {
    useDocumentTitle(title);

    const { id: idAluno } = useParams();
    
    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'diaSemana', label: 'Dia da Semana' },
        { id: 'horarioInicio', label: 'Horario de Início' },
        { id: 'horarioTermino', label: 'Horario de Término' },
        { id: 'sala', label: 'Sala' },
        { id: 'disciplina', label: 'Disciplina' },
        { id: 'professor', label: 'Professor' }
    ];

    const [turmas, setTurmas] = useState([]);
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateTurmas();
        }

        fetchData();
    }, []);

    async function updateTurmas() {
        try {
            const response = await apiTurma.mostrarTurmasSemOAluno(idAluno);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar turmas:", error);
                insertMensagem(refMensagem, "Erro ao buscar turmas.", false);

                setTurmas([]);
                return;
            }

            const turmas = await response.json();

            setTurmas(turmas);
        } catch (error) {
            console.error("Erro ao buscar turmas:", error);
            insertMensagem("Erro ao buscar turmas.", false);
            setTurmas([]);
        }
    }

    function getData() {
        return Array.isArray(turmas) ? turmas.map(turma => {
            return {
                id: turma.idTurma,
                nome: turma.nome,
                diaSemana: turma.diaSemana,
                horarioInicio: turma.horarioInicio,
                horarioTermino: turma.horarioTermino,
                sala: turma.sala.nome,
                disciplina: turma.disciplina.nome,
                professor: turma.professor.nome
            };
        }) : [];
    }

    async function handleMatricularClick(idTurma) {
        try {
            const response = await apiAluno.matricularAluno(idAluno, idTurma);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao matricular aluno:", error);
                insertMensagem(refMensagem, "Erro ao matricular aluno.", false);

                return;
            }

            await updateTurmas();
            insertMensagem(refMensagem, "Aluno matriculado com sucesso.", true);
        } catch (error) {
            console.error("Erro ao matricular aluno:", error);
            insertMensagem(refMensagem, "Erro ao matricular aluno.", false);
        }
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateTurmas();
        }

        try {
            const response = await apiTurma.mostrarTurmasSemOAluno(idAluno, pesquisa);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar turmas:", error);
                insertMensagem(refMensagem, "Erro ao buscar turmas.", false);

                setTurmas([]);
                return;
            }

            const turmas = await response.json();

            setTurmas(turmas);
        } catch (error) {
            console.error("Erro ao buscar turmas:", error);
            insertMensagem(refMensagem, "Erro ao buscar turmas.", false);

            setTurmas([]);
        }
    }

    return (
        <Mostrar
            titulo={"Matricular Aluno"}
            buttonVoltar={<Link to="/aluno" className="buttonVoltar button">Voltar</Link>}
            columns={columns}
            data={getData()}
            buttons={[
                {
                    label: "Matricular",
                    onClick: handleMatricularClick,
                },
            ]}
            handlePesquisar={handlePesquisar}
            divMensagem={<div ref={ refMensagem } className="mensagem mensagem--hidden"></div>}
        />
    );
}

export default AlunoMatricular;
