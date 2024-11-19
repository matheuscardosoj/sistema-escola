/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Mostrar from "../components/Mostrar";
import ApiSala from "../api/ApiSala";
import { useEffect, useRef, useState } from "react";
import { insertMensagem, useDocumentTitle } from "../utils/helpers";

const apiSala = new ApiSala();

function SalaMostrarInativos({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'local', label: 'Local' },
        { id: 'capacidade', label: 'Capacidade' },
    ];

    const [salasInativas, setSalasInativas] = useState([]);
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateSalasInativas();
        }

        fetchData();
    }, []);

    async function updateSalasInativas() {
        try {
            const response = await apiSala.pegarSalasInativas();
            
            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar salas inativas:", error);
                insertMensagem(refMensagem, "Erro ao buscar salas inativas.", false);
                setSalasInativas([]);

                return;
            }

            const salasInativas = await response.json();
            setSalasInativas(salasInativas);
        } catch (error) {
            console.error("Erro ao buscar salas inativas:", error);
            insertMensagem("Erro ao buscar salas inativas.", false);
            setSalasInativas([]);
        }
    }

    function getData() {
        return Array.isArray(salasInativas) ? salasInativas.map(sala => {
            return {
                id: sala.idSala,
                nome: sala.nome,
                local: sala.local,
                capacidade: sala.capacidade,
            };
        }) : [];
    }

    async function handleEnableClick(id) {
        try {
            const response = await apiSala.ativarSala(id);

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao ativar sala:", error);
                insertMensagem(refMensagem, "Erro ao ativar sala.", false);

                return;
            }

            await updateSalasInativas();
            insertMensagem(refMensagem, "Sala ativada com sucesso.", true);
        } catch (error) {
            console.error("Erro ao ativar sala:", error);
            insertMensagem(refMensagem, "Erro ao ativar sala.", false);
        }
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateSalasInativas();
            return;
        }

        try {
            const response = await apiSala.pegarSalasFiltradas(pesquisa, 'inativo');

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar salas filtradas:", error);
                insertMensagem(refMensagem, "Erro ao buscar salas filtradas.", false);

                return;
            }
            
            const salas = await response.json();

            setSalasInativas(salas);
        } catch (error) {
            console.error("Erro ao buscar salas filtradas:", error);
        }
    }

    return (
        <Mostrar
            titulo="Salas Inativas"
            buttonVoltar={<Link to="/sala" className="buttonVoltar button">Voltar</Link>}
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

export default SalaMostrarInativos;
