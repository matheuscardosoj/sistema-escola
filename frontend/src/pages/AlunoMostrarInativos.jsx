/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Mostrar from "../components/Mostrar";
import ApiAluno from "../api/ApiAluno";
import { useEffect, useRef, useState } from "react";
import { formataCPF, formataTelefone, insertMensagem, useDocumentTitle } from "../utils/helpers";

const apiAluno = new ApiAluno();

function AlunoMostrarInativos({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'cpf', label: 'CPF' },
        { id: 'endereco', label: 'Endereço' },
        { id: 'telefone', label: 'Telefone' },
    ];

    const [alunosInativos, setAlunosInativos] = useState([]);
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateAlunosInativos();
        }

        fetchData();
    }, []);

    async function updateAlunosInativos() {
        try {
            const response = await apiAluno.pegarAlunosInativos();

            if (response.status !== 200) {
                const { error } = await response.json();
                console.error("Erro ao buscar alunos:", error);
                return;
            }

            const alunos = await response.json();
            setAlunosInativos(alunos);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
            insertMensagem("Erro ao buscar alunos.", false);
            setAlunosInativos([]);
        }
    }

    function getData() {
        return Array.isArray(alunosInativos) ? alunosInativos.map(aluno => {
            return {
                id: aluno.idAluno,
                nome: aluno.nome,
                cpf: formataCPF(aluno.cpf),
                endereco: aluno.endereco,
                telefone: formataTelefone(aluno.telefone),
            };
        }) : [];
    }

    async function handleEnableClick(id) {
        try {
            const response = await apiAluno.ativarAluno(id);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao ativar aluno:", error);
                insertMensagem(refMensagem, "Erro ao ativar aluno.", false);

                return;
            }

            await updateAlunosInativos();
            insertMensagem(refMensagem, "Aluno ativado com sucesso.", true);
        } catch (error) {
            console.error("Erro ao ativar aluno:", error);
            insertMensagem(refMensagem, "EErro ao ativar aluno.", false);
        }
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateAlunosInativos();
            return;
        }

        try {
            const response = await apiAluno.pegarAlunosFiltrados(pesquisa, 'inativo');

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar alunos filtrados:", error);
                insertMensagem(refMensagem, "Erro ao buscar alunos filtrados.", false);
            }

            const alunos = await response.json();
            setAlunosInativos(alunos);
        } catch (error) {
            console.error("Erro ao buscar alunos filtrados:", error);
            insertMensagem(refMensagem, "Erro ao buscar alunos filtrados.", false);
        }
    }

    return (
        <Mostrar
            titulo={"Mostrar alunos inativos"}
            buttonVoltar={<Link to="/aluno" className="buttonVoltar button">Voltar</Link>}
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

export default AlunoMostrarInativos;
