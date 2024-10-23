import ApiTurma from '../../api/ApiTurma.js';
import ApiSala from '../../api/ApiSala.js';
import ApiDisciplina from '../../api/ApiDisciplina.js';
import ApiProfessor from '../../api/ApiProfessor.js';
import { deixarApenasDigitos, formataDataParaAnoSemestre, mostrarMensagem, redirecionar } from '../../utils/helpers.js';

(async function() {
    const inputNomeTurma = document.getElementById('nomeTurma');
    const inputAnoTurma = document.getElementById('anoTurma');
    const selectSemestreTurma = document.getElementById('semestreTurma');
    const inputHoraInicioTurma = document.getElementById('horaInicioTurma');
    const inputHoraTerminoTurma = document.getElementById('horaTerminoTurma');
    const selectSalas = document.getElementById('idSala');
    const selectDisciplinas = document.getElementById('idDisciplina');
    const selectProfessores = document.getElementById('idProfessor');
    const divMensagem = document.getElementById('mensagem');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const form = document.getElementsByClassName('form')[0];
    const apiTurma = new ApiTurma();
    const apiSala = new ApiSala();
    const apiDisciplina = new ApiDisciplina();
    const apiProfessor = new ApiProfessor();   

    const urlParams = new URLSearchParams(window.location.search);
    const idTurma = urlParams.get('idTurma');
    
    if (!idTurma) {
        redirecionar('http://localhost/src/pages/turma/gerenciar.html');
    }

    async function preencherCampos() {
        try {
            const response = await apiTurma.pegarTurma(idTurma);

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar a turma', true);
                return;
            }

            const turma = await response.json();

            let anoSemestreArray = turma.anoSemestre.split('/');

            const ano = anoSemestreArray[0];
            const semestre = anoSemestreArray[1];

            inputNomeTurma.value = turma.nome;
            inputAnoTurma.value = ano;
            selectSemestreTurma.value = semestre;
            inputHoraInicioTurma.value = turma.horaInicio;
            inputHoraTerminoTurma.value = turma.horaTermino;
            selectSalas.value = turma.sala.idSala;
            selectDisciplinas.value = turma.disciplina.idDisciplina;
            selectProfessores.value = turma.professor.idProfessor;
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar a turma', true);
        }
    }

    async function recarregarSelect(dados, select, value, textoInicial, texto = 'nome') {
        select.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.text = textoInicial;
        select.appendChild(option);

        dados.forEach(dado => {
            const option = document.createElement('option');
            option.value = dado[value];
            option.text = dado[texto];
            select.appendChild(option);
        });
    }

    async function inserirSalas() {
        try {
            const response = await apiSala.pegarSalas();

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
                return;
            }

            const salas = await response.json();

            recarregarSelect(salas, selectSalas, 'idSala', 'Selecione uma sala');
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
        }
    }

    async function inserirDisciplinas() {
        try {
            const response = await apiDisciplina.pegarDisciplinas();

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar disciplinas', true);
                return;
            }

            const disciplinas = await response.json();

            recarregarSelect(disciplinas, selectDisciplinas, 'idDisciplina', 'Seleciona uma disciplina');
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar disciplinas', true);
        }
    }

    async function inserirProfessores() {                       
        try {
            const response = await apiProfessor.pegarProfessores();

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
                return;
            }

            const professores = await response.json();

            recarregarSelect(professores, selectProfessores, 'idProfessor', 'Selecione um professor');
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
        }
    }
    
    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        inputAnoTurma.addEventListener('input', async () => {
            inputAnoTurma.value = deixarApenasDigitos(inputAnoTurma.value);
        });

        buttonEnviar.addEventListener('click', async () => {
            try {
                const nome = inputNomeTurma.value;
                const ano = inputAnoTurma.value;
                const semestre = selectSemestreTurma.value;
                const horaInicio = inputHoraInicioTurma.value;
                const horaTermino = inputHoraTerminoTurma.value;
                let idSala = selectSalas.value;
                let idDisciplina = selectDisciplinas.value;
                let idProfessor = selectProfessores.value;

                if(!nome || !ano || !semestre || !horaInicio || !horaTermino || !idSala || !idDisciplina || !idProfessor) {
                    await mostrarMensagem(divMensagem, 'Preencha todos os campos', true);
                    return;
                }

                idSala = Number(idSala);
                idDisciplina = Number(idDisciplina);
                idProfessor = Number(idProfessor);
                
                const anoSemestre = formataDataParaAnoSemestre(ano, semestre);

                const response = await apiTurma.alterarTurma(idTurma, nome, anoSemestre, horaInicio, horaTermino, idSala, idDisciplina, idProfessor);

                if(response.status !== 200) {
                    await mostrarMensagem(divMensagem, 'Erro ao alterar a turma', true);
                    return;
                }

                inputNomeTurma.value = '';
                inputAnoTurma.value = '';
                selectSemestreTurma.value = '';
                inputHoraInicioTurma.value = '';
                inputHoraTerminoTurma.value = '';
                selectSalas.value = '';
                selectDisciplinas.value = '';
                selectProfessores.value = '';

                inputNomeTurma.focus();

                await mostrarMensagem(divMensagem, 'Turma alterada com sucesso');

            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao alterar a turma', true);
            }
        });
    }

    async function main() {
        await inserirSalas();
        await inserirDisciplinas();
        await inserirProfessores();
        await preencherCampos();
        executarListeners();
    }

    main();
})();