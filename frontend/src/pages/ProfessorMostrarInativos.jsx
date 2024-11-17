/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import MostrarInativos from "../components/MostrarInativos";
import ApiProfessor from "../api/ApiProfessor";
import { useEffect, useRef, useState } from "react";
import { formataCPF, formataTelefone, insertMensagem, useDocumentTitle } from "../utils/helpers";

const apiProfessor = new ApiProfessor();

function ProfessorMostrarInativos({ title }) {
    useDocumentTitle(title);

    const columns = [
        { id: 'nome', label: 'Nome' },
        { id: 'cpf', label: 'CPF' },
        { id: 'titulo', label: 'Título' },
        { id: 'endereco', label: 'Endereço' },
        { id: 'telefone', label: 'Telefone' },
    ];

    const [professoresInativos, setProfessoresInativos] = useState([]);
    const refMensagem = useRef(null);

    useEffect(() => {
        async function fetchData() {
            await updateProfessoresInativos();
        }

        fetchData();
    }, []);

    async function updateProfessoresInativos() {
        try {
            const response = await apiProfessor.pegarProfessoresInativos();
            
            if (response.status !== 200) {
                const { error } = await response.json();
                console.error("Erro ao buscar professores inativos:", error);
                insertMensagem(refMensagem, "Erro ao buscar professores inativos.", false);
                setProfessoresInativos([]);
                return;
            }

            const professoresInativos = await response.json();
            setProfessoresInativos(professoresInativos);
        } catch (error) {
            console.error("Erro ao buscar professores inativos:", error);
            insertMensagem("Erro ao buscar professores inativos.", false);
            setProfessoresInativos([]);
        }
    }

    function getData() {
        return Array.isArray(professoresInativos) ? professoresInativos.map(professor => {
            return {
                id: professor.idProfessor,
                nome: professor.nome,
                cpf: formataCPF(professor.cpf),
                titulo: professor.titulo,
                endereco: professor.endereco,
                telefone: formataTelefone(professor.telefone),
            };
        }) : [];
    }

    async function handleEnableClick(id) {
        try {
            const response = await apiProfessor.ativarProfessor(id);

            if (response.status !== 200) {
                const { error } = await response.json();
                console.error("Erro ao ativar professor:", error);
                insertMensagem(refMensagem, "Erro ao ativar professor.", false);
                return;
            }

            await updateProfessoresInativos();
            insertMensagem(refMensagem, "Professor ativado com sucesso.", true);
        } catch (error) {
            console.error("Erro ao ativar professor:", error);
            insertMensagem(refMensagem, "Erro ao ativar professor.", false);
        }
    }

    async function handlePesquisar(event) {
        const pesquisa = event.target.value;

        if (pesquisa.trim() === "") {
            updateProfessoresInativos();
            return;
        }

        try {
            const response = await apiProfessor.pegarProfessoresFiltrados(pesquisa, 'inativo');

            if (response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao buscar professores filtrados:", error);
                insertMensagem(refMensagem, "Erro ao buscar professores filtrados.", false);

                return;
            }

            const professores = await response.json();

            setProfessoresInativos(professores);
        } catch (error) {
            console.error("Erro ao buscar professores filtrados:", error);
        }
    }

    return (
        <MostrarInativos
            titulo={"Mostrar professores inativos"}
            buttonVoltar={<Link to="/professor" className="buttonVoltar button">Voltar</Link>}
            columns={columns}
            data={getData()}
            handleEnableClick={handleEnableClick}
            handlePesquisar={handlePesquisar}
            divMensagem={<div ref={ refMensagem } className="mensagem mensagem--hidden"></div>}
        />
    );
}

export default ProfessorMostrarInativos;