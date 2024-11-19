/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Mostrar from "../components/Mostrar";
import ApiTurma from "../api/ApiTurma";
import { useEffect, useRef, useState } from "react";
import { formataCPF, formataTelefone, insertMensagem, useDocumentTitle } from "../utils/helpers";

const apiTurma = new ApiTurma();

function TurmaMostrarInativos({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'diaSemana', label: 'Dia da Semana' },
        { id: 'horarioInicio', label: 'Horario de Início' },
        { id: 'horarioTermino', label: 'Horario de Término' },
        { id: 'sala', label: 'Sala' },
        { id: 'disciplina', label: 'Disciplina' },
        { id: 'professor', label: 'Professor' }
    ];

    const [turmasInativas, setTurmasInativas] = useState([]);
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateTurmasInativas();
        }

        fetchData();
    }, []);

    async function updateTurmasInativas() {
        try {
            const response = await apiTurma.pegarTurmasInativas();
            
            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar turmas inativas:", error);
                insertMensagem(refMensagem, "Erro ao buscar turmas inativas.", false);

                setTurmasInativas([]);
                return;
            }

            const turmasInativas = await response.json();
            
            setTurmasInativas(turmasInativas);
        } catch (error) {
            console.error("Erro ao buscar turmas inativas:", error);
            insertMensagem("Erro ao buscar turmas inativas.", false);
            setTurmasInativas([]);
        }
    }

    function getData() {
        return Array.isArray(turmasInativas) ? turmasInativas.map(turma => {
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

    async function handleEnableClick(id) {
        try {
            const response = await apiTurma.ativarTurma(id);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao ativar turma:", error);
                insertMensagem(refMensagem, "Erro ao ativar turma.", false);
                
                return;
            }

            await updateTurmasInativas();
            insertMensagem(refMensagem, "Turma ativada com sucesso.", true);
        } catch (error) {
            console.error("Erro ao ativar turma:", error);
            insertMensagem(refMensagem, "Erro ao ativar turma.", false);
        }
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if(pesquisa.trim() === '') {
            updateTurmasInativas();
            return;
        }

        try {
            const response = await apiTurma.pegarTurmasFiltradas(pesquisa, 'inativo');

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar turmas filtradas:", error);
                insertMensagem(refMensagem, "Erro ao buscar turmas filtradas.", false);

                return;
            }

            const turmas = await response.json();

            setTurmasInativas(turmas);
        } catch (error) {
            console.error("Erro ao buscar turmas filtradas:", error);
            insertMensagem(refMensagem, "Erro ao buscar turmas filtradas.", false);
        }
    }

    return (
        <Mostrar
            titulo={"Mostrar turmas inativas"}
            buttonVoltar={<Link to="/turma" className="buttonVoltar button">Voltar</Link>}
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

export default TurmaMostrarInativos;
