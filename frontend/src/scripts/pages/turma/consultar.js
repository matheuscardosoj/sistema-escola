import ApiTurma from "../../api/ApiTurma.js";
import { capitalize } from "../../utils/helpers.js";

(async function() {
    const tableTurma = document.getElementById('tableTurma');
    const apiTurma = new ApiTurma();
    const searchParams = new URLSearchParams(window.location.search);
    const idTurma = searchParams.get('idTurma');

    function carregarTabela(turmas, erro = false) {
        if(erro) {
            const tbody = tableTurma.getElementsByTagName('tbody')[0];

            const tr = document.createElement('tr');
            const td = document.createElement('td');

            td.colSpan = 8;
            td.textContent = 'Erro ao buscar as turmas';
            
            tr.appendChild(td);

            tbody.appendChild(tr); 
        } else {           
            if(turmas.length === 0) {                
                const tbody = tableTurma.getElementsByTagName('tbody')[0];

                const tr = document.createElement('tr');
                const td = document.createElement('td');

                td.colSpan = 8;
                td.textContent = 'Nenhuma turma encontrada';

                tr.appendChild(td);

                tbody.appendChild(tr);
            } else {
                const tbody = tableTurma.getElementsByTagName('tbody')[0];

                turmas.forEach(turma => {
                    const tr = document.createElement('tr');
                    const tdIdTurma = document.createElement('td');
                    const tdNomeTurma = document.createElement('td');
                    const tdAnoSemestre = document.createElement('td');
                    const tdHorario = document.createElement('td');
                    const tdStatus = document.createElement('td');
                    const tdDisciplina = document.createElement('td');
                    const tdSala = document.createElement('td');
                    const tdProfessor = document.createElement('td');

                    tdIdTurma.textContent = turma.idTurma;
                    tdNomeTurma.textContent = capitalize(turma.nome);
                    tdAnoSemestre.textContent = turma.anoSemestre;
                    tdHorario.textContent = `${turma.horaInicio} - ${turma.horaTermino}`;
                    tdStatus.textContent = capitalize(turma.status);
                    tdSala.textContent = `${turma.sala.idSala} | ${capitalize(turma.sala.nome)}`;                    
                    tdDisciplina.textContent = `${turma.disciplina.idDisciplina} | ${capitalize(turma.disciplina.nome)}`;
                    tdProfessor.textContent = `${turma.professor.idProfessor} | ${capitalize(turma.professor.nome)}`;

                    tr.appendChild(tdIdTurma);
                    tr.appendChild(tdNomeTurma);
                    tr.appendChild(tdAnoSemestre);
                    tr.appendChild(tdHorario);
                    tr.appendChild(tdStatus);
                    tr.appendChild(tdDisciplina);
                    tr.appendChild(tdSala);
                    tr.appendChild(tdProfessor);

                    tbody.appendChild(tr);
                });
            }
        }
    }

    async function inserirTurmas() {
        if(!idTurma) {
            try {
                const response = await apiTurma.pegarTurmas();

                if(response.status === 200) {
                    const turmas = await response.json(); 

                    console.log(turmas);

                    carregarTabela(turmas);
                } else {
                    carregarTabela([], true);
                }
            } catch(error) {
                console.log(error);
                carregarTabela([], true);
            }
        } else {
            try {
                const response = await apiTurma.pegarTurma(idTurma);

                if(response.status === 200) {
                    const turma = await response.json();
                    
                    carregarTabela([turma]);
                } else {
                    carregarTabela([], true);
                }
            } catch(error) {
                carregarTabela([], true);
            }
        }
    }

    async function main() {
        await inserirTurmas();
    } 

    main();
})();
