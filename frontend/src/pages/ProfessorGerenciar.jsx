/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import ApiProfessor from "../api/ApiProfessor";
import Gerenciar from '../components/Gerenciar';
import { useNavigate } from 'react-router-dom';
import { formataCPF, formataTelefone, insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiProfessor = new ApiProfessor();

function ProfessorGerenciar({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'cpf', label: 'CPF' },
        { id: 'titulo', label: 'Título' },
        { id: 'endereco', label: 'Endereço' },
        { id: 'telefone', label: 'Telefone' },
    ];

    const [professores, setProfessores] = useState([]);
    const navigate = useNavigate();
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateProfessores();
        }

        fetchData();
    }, []);

    async function updateProfessores() {
        const response = await apiProfessor.pegarProfessoresAtivos();

        if (response.status !== 200) {
            const error = await response.json();
            console.error("Erro ao buscar professores:", error);
            return;
        }

        const professores = await response.json();
        setProfessores(professores);
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateProfessores();
            return;
        }

        try {
            const response = await apiProfessor.pegarProfessoresFiltrados(pesquisa, 'ativo');
            const professores = await response.json();

            setProfessores(professores);
        } catch (error) {
            console.error("Erro ao buscar professores filtrados:", error);
        }
    }

    function handleEditClick(id) {
        navigate(`/professor/editar/${id}`);
    }

    async function handleDisableClick(id) {
        try {
            const response = await apiProfessor.desativarProfessor(id);

            if (response.status !== 200) {
                console.error("Erro ao desativar professor:", response);
                insertMensagem(refMensagem, "Erro ao desativar professor.", false);
                return;
            }

            await updateProfessores();
            insertMensagem(refMensagem, 'Professor desativado com sucesso!');
        } catch (error) {
            console.error("Erro ao desativar professor:", error);
            insertMensagem(refMensagem, 'danger', 'Erro ao desativar professor.', false);
        }
    }

    function handleInsertClick() {
        navigate('/professor/inserir');
    }

    function handleShowInactiveClick() {
        navigate('/professor/inativos');
    }

    function getData() {
        return Array.isArray(professores) ? professores.map((professor) => {
            return {
                id: professor.idProfessor,
                nome: professor.nome,
                cpf: formataCPF(professor.cpf),
                titulo: professor.titulo,
                endereco: professor.endereco,
                telefone: formataTelefone(professor.telefone)
            };
        }) : [];
    }

    return (
        <Gerenciar
            titulo={"Gerenciar Professores"}
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

export default ProfessorGerenciar;
