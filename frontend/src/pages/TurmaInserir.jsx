/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import ApiTurma from '../api/ApiTurma';
import '../assets/styles/global.css';
import Inserir from '../components/Inserir';
import { useEffect, useRef, useState } from 'react';
import { insertMensagem, insertMensagemWithNavigate, useDocumentTitle } from '../utils/helpers';
import ApiDisciplina from '../api/ApiDisciplina';
import ApiProfessor from '../api/ApiProfessor';
import ApiSala from '../api/ApiSala';

const apiTurma = new ApiTurma();

function TurmaInserir({ title }) {
    useDocumentTitle(title);

    const refMensagem = useRef(null);
    const inputRefs = {
        nome: useRef(null),
        diaSemana: useRef(null),
        horarioInicio: useRef(null),
        horarioTermino: useRef(null),
        idDisciplina: useRef(null),
        idProfessor: useRef(null),
        idSala: useRef(null)
    };

    const [formValues, setFormValues] = useState({
        nome: "",
        diaSemana: "",
        horarioInicio: "",
        horarioTermino: "",
        idDisciplina: "",
        idProfessor: "",
        idSala: ""
    });

    const [disciplinas, setDisciplinas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [salas, setSalas] = useState([]);

    const [disable, setDisable] = useState(false);

    useEffect(() => {
        const apiDisciplina = new ApiDisciplina();
        const apiProfessor = new ApiProfessor();
        const apiSala = new ApiSala();

        async function fetchData() {
            try {
                const responseDisciplina = await apiDisciplina.pegarDisciplinasAtivas();
                const responseProfessor = await apiProfessor.pegarProfessoresAtivos();
                const responseSala = await apiSala.pegarSalasAtivas();

                if (responseDisciplina.status !== 200 || responseProfessor.status !== 200 || responseSala.status !== 200) {
                    setDisable(true);

                    console.log("Erro ao buscar disciplinas, professores ou salas ativos.");

                    insertMensagemWithNavigate(refMensagem, "Erro ao buscar disciplinas, professores ou salas ativos.", false, "/turma");

                    return;
                }

                const disciplinasResponse = await responseDisciplina.json();
                const professoresResponse = await responseProfessor.json();
                const salasResponse = await responseSala.json();              

                if (disciplinasResponse.length === 0 || professoresResponse.length === 0 || salasResponse.length === 0) {
                    setDisable(true);

                    insertMensagemWithNavigate(refMensagem, "Não há disciplinas, professores ou salas ativos.", false, "/turma");

                    return;
                }

                setDisciplinas(disciplinasResponse);
                setProfessores(professoresResponse);
                setSalas(salasResponse);
            } catch (error) {
                setDisable(true);

                console.error("Erro ao buscar disciplinas, professores ou salas ativos:", error);
                insertMensagemWithNavigate(refMensagem, "Erro ao buscar disciplinas, professores ou salas ativos.", false, "/turma");
            }
        }

        fetchData();
    }, []);

    
    function handleInputChange(e) {
        const { id, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value
        }));
    };

    function clearInputsAndFocusFirst() {
        setFormValues({
            nome: "",
            diaSemana: "",
            horarioInicio: "",
            horarioTermino: "",
            idDisciplina: "",
            idProfessor: "",
            idSala: ""
        });
        
        inputRefs.nome.current.focus();
    }

    function validaInputs(nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala) {
        let mensagens = [];
        let valido = true;

        nome = String(nome);
        diaSemana = String(diaSemana);
        horarioInicio = String(horarioInicio);
        horarioTermino = String(horarioTermino);
        idDisciplina = String(idDisciplina);
        idProfessor = String(idProfessor);
        idSala = String(idSala);

        console.log(nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala);

        if (nome.trim() === "" || diaSemana.trim() === "" || horarioInicio.trim() === "" || horarioTermino.trim() === "" || idDisciplina.trim() === "" || idProfessor.trim() === "" || idSala.trim() === "") {
            mensagens.push("Preencha todos os campos.");
            valido = false;
        }

        if(nome.length < 3) {
            mensagens.push("O nome deve ter no mínimo 3 caracteres.");
            valido = false;
        }

        if (diaSemana.length === 0) {
            mensagens.push("Selecione um dia da semana.");
            valido = false;
        }

        if (horarioInicio.length !== 5 || !/^[0-2][0-9]:[0-5][0-9]$/.test(horarioInicio)) {
            mensagens.push("Horário de início inválido.");
            valido = false;
        }

        if (horarioTermino.length !== 5 || !/^[0-2][0-9]:[0-5][0-9]$/.test(horarioTermino)) {
            mensagens.push("Horário de término inválido.");
            valido = false;
        }

        if (idDisciplina.length === 0) {
            mensagens.push("Selecione uma disciplina.");
            valido = false;
        }

        if (idProfessor.length === 0) {
            mensagens.push("Selecione um professor.");
            valido = false;
        }

        if (idSala.length === 0) {
            mensagens.push("Selecione uma sala.");
            valido = false;
        }

        return { valido, mensagens };
    }

    async function handleEnviarClick() {
        try {
            const { nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala } = formValues;

            const { valido, mensagens } = validaInputs(nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala);

            if (!valido) {
                insertMensagem(refMensagem, mensagens, false);
                return;
            }

            const response = await apiTurma.criarTurma(nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala);

            if(response.status !== 200) {
                const { error } = await response.json();

                console.error("Erro ao inserir turma:", error);
                insertMensagem(refMensagem, "Erro ao inserir turma.", false);

                return;
            }

            insertMensagem(refMensagem, "Turma inserida com sucesso.", true);
            clearInputsAndFocusFirst();
        } catch (error) {
            console.error("Erro ao inserir turma:", error);
            insertMensagem(refMensagem, "Erro ao inserir turma.", false);
        }
    }

    return (
        <Inserir
            titulo="Inserir Turma"
            buttonVoltar={<Link to="/turma" className="buttonVoltar button">Voltar</Link>}
            inputs={[
                <div className="form__containerElement" key="nome">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" ref={inputRefs.nome} value={formValues.nome} onChange={handleInputChange} disabled={disable} />
                </div>,

                <div className="form__containerElement" key="diaSemana">
                    <label htmlFor="diaSemana">Dia da Semana:</label>
                    <select id="diaSemana" ref={inputRefs.diaSemana} value={formValues.diaSemana} onChange={handleInputChange} disabled={disable}>
                        <option value="">Selecione uma opção</option>
                        <option value="Segunda">Segunda</option>
                        <option value="Terça">Terça</option>
                        <option value="Quarta">Quarta</option>
                        <option value="Quinta">Quinta</option>
                        <option value="Sexta">Sexta</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                    </select>
                </div>,

                <div className="form__containerElement" key="horarioInicio">
                    <label htmlFor="horarioInicio">Horário de Início:</label>
                    <input type="time" id="horarioInicio" ref={inputRefs.horarioInicio} value={formValues.horarioInicio} onChange={handleInputChange} disabled={disable} />
                </div>,

                <div className="form__containerElement" key="horarioTermino">
                    <label htmlFor="horarioTermino">Horário de Término:</label>
                    <input type="time" id="horarioTermino" ref={inputRefs.horarioTermino} value={formValues.horarioTermino} onChange={handleInputChange} disabled={disable} />
                </div>,

                <div className="form__containerElement" key="disciplina">
                    <label htmlFor="idDisciplina">Disciplina:</label>
                    <select id="idDisciplina" ref={inputRefs.idDisciplina} value={formValues.idDisciplina} onChange={handleInputChange} disabled={disable}>
                        <option value="">Selecione uma opção</option>
                        {disciplinas.map((disciplina) => <option key={disciplina.idDisciplina} value={disciplina.idDisciplina}>{disciplina.nome}</option>)}
                    </select>
                </div>,

                <div className="form__containerElement" key="professor">
                    <label htmlFor="idProfessor">Professor:</label>
                    <select id="idProfessor" ref={inputRefs.idProfessor} value={formValues.idProfessor} onChange={handleInputChange} disabled={disable}>
                        <option value="">Selecione uma opção</option>
                        {professores.map((professor) => <option key={professor.idProfessor} value={professor.idProfessor}>{professor.nome}</option>)}
                    </select>
                </div>,

                <div className="form__containerElement" key="sala">
                    <label htmlFor="idSala">Sala:</label>
                    <select id="idSala" ref={inputRefs.idSala} value={formValues.idSala} onChange={handleInputChange} disabled={disable}>
                        <option value="">Selecione uma opção</option>
                        {salas.map((sala) => <option key={sala.idSala} value={sala.idSala}>{sala.nome}</option>)}
                    </select>
                </div>
            ]}
            handleEnviarClick={handleEnviarClick}
            divMensagem={<div className="mensagem mensagem--hidden" ref={refMensagem}></div>}
        />
    );
}

export default TurmaInserir;
