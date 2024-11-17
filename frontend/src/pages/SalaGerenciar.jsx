/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import ApiSala from "../api/ApiSala";
import Gerenciar from '../components/Gerenciar';
import { useNavigate } from 'react-router-dom';
import { insertMensagem, useDocumentTitle } from '../utils/helpers';

const apiSala = new ApiSala();

function SalaGerenciar({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'local', label: 'Local' },
        { id: 'capacidade', label: 'Capacidade' },
    ];
    const [salas, setSalas] = useState([]);
    const navigate = useNavigate();
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateSalas();
        }

        fetchData();
    }, []);

    async function updateSalas() {
        const response = await apiSala.pegarSalasAtivas();

        if (response.status !== 200) {
            const { error } = await response.json();
            console.error("Erro ao buscar salas:", error);
            return;
        }

        const salas = await response.json();
        setSalas(salas);
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateSalas();
            return;
        }

        try {
            const response = await apiSala.pegarSalasFiltradas(pesquisa, 'ativo');
            
            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar salas filtradas:", error);
                insertMensagem(refMensagem, "Erro ao buscar salas filtradas.", false);

                return;
            }

            const salas = await response.json();

            setSalas(salas);
        } catch (error) {
            console.error("Erro ao buscar salas filtradas:", error);
        }
    }

    function handleEditClick(id) {
        navigate(`/sala/editar/${id}`);
    }

    async function handleDisableClick(id) {
        const response = await apiSala.desativarSala(id);

        if (response.status !== 200) {
            const { error } = await response.json();

            console.error("Erro ao desativar sala:", error);
            insertMensagem(refMensagem,"Erro ao desativar sala.", false);

            return;
        }

        insertMensagem(refMensagem, 'Sala desativada com sucesso!');
        await updateSalas();
    }

    function handleInsertClick() {
        navigate('/sala/inserir');        
    }

    function handleShowInactiveClick() {
        navigate('/sala/inativos');        
    }

    function getData() {
        return Array.isArray(salas) ? salas.map(sala => ({
            id: sala.idSala,
            nome: sala.nome,
            local: sala.local,
            capacidade: sala.capacidade
        })) : [];
    }

    return (
        <Gerenciar
            titulo={"Gerenciar Salas"}
            columns={columns}
            data={getData()}
            handleEditClick={handleEditClick}
            handleDisableClick={handleDisableClick}
            handleInsertClick={handleInsertClick}
            handleShowInactiveClick={handleShowInactiveClick}
            handlePesquisar={handlePesquisar}
            divMensagem={<div className="mensagem mensagem--hidden" ref={refMensagem}></div>}
        />
    );
};

export default SalaGerenciar;
