/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import ApiAluno from "../api/ApiAluno";
import Gerenciar from '../components/Gerenciar';
import { useNavigate } from 'react-router-dom';
import { formataCPF, formataTelefone, insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiAluno = new ApiAluno();

function AlunoGerenciar({ title }) {
    useDocumentTitle(title);
  
    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'cpf', label: 'CPF' },
        { id: 'endereco', label: 'Endereço' },
        { id: 'telefone', label: 'Telefone' },
    ];

    const [alunos, setAlunos] = useState([]);
    const navigate = useNavigate();
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateAlunos();
        }

        fetchData();
    }, []);

    async function updateAlunos() {
        const response = await apiAluno.pegarAlunosAtivos();

        if (response.status !== 200) {
            const { error } = await response.json();
            console.error("Erro ao buscar alunos:", error);
            return;
        }

        const alunos = await response.json();
        setAlunos(alunos);
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateAlunos();
            return;
        }

        try {
            const response = await apiAluno.pegarAlunosFiltrados(pesquisa, 'ativo');

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar alunos filtrados:", error);
                insertMensagem(refMensagem, "Erro ao buscar alunos filtrados.", false);

                return;
            }

            const alunos = await response.json();

            setAlunos(alunos);
        } catch (error) {
            console.error("Erro ao buscar alunos filtrados:", error);
            insertMensagem(refMensagem, "Erro ao buscar alunos filtrados.", false);
        }
    }

    function handleEditClick(id) {
        navigate(`/aluno/editar/${id}`);
    }

    async function handleDisableClick(id) {
        try {
            const response = await apiAluno.desativarAluno(id);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao desativar aluno:", error);
                insertMensagem(refMensagem, "Erro ao desativar aluno.", false);

                return;
            }

            await updateAlunos();
            insertMensagem(refMensagem, "Aluno desativado com sucesso.", true);
        } catch (error) {
            console.error("Erro ao desativar aluno:", error);
            insertMensagem(refMensagem, "Erro ao desativar aluno.", false);
        }
    }

    function handleInsertClick() {
        navigate('/aluno/inserir');
    }

    function handleShowInactiveClick() {
        navigate('/aluno/inativos');
    }

    function getData() {
        return Array.isArray(alunos) ? alunos.map(aluno => ({
            id: aluno.idAluno,
            nome: aluno.nome,
            cpf: formataCPF(aluno.cpf),
            endereco: aluno.endereco,
            telefone: formataTelefone(aluno.telefone)
        })) : [];
    }

    return (
        <Gerenciar
            titulo={"Gerenciar Alunos"}
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

export default AlunoGerenciar;
