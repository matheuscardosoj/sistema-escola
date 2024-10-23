import ApiProfessor from "../../api/ApiProfessor.js";
import { capitalize, formataCpf, formataTelefone } from "../../utils/helpers.js";

(async function() {
    const tableProfessor = document.getElementById('tableProfessor');
    const apiProfessor = new ApiProfessor();
    const searchParams = new URLSearchParams(window.location.search);
    const idProfessor = searchParams.get('idProfessor');

    console.log(tableProfessor);
    

    function carregarTabela(professores, erro = false) {
        if(erro) {
            const tbody = tableProfessor.getElementsByTagName('tbody')[0];

            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 6;
            td.textContent = 'Erro ao buscar os professores';

            tr.appendChild(td);

            tbody.appendChild(tr);
        } else {
            if(professores.length === 0) {
                const tbody = tableProfessor.getElementsByTagName('tbody')[0];

                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 6;
                td.textContent = 'Nenhum professor encontrado';

                tr.appendChild(td);

                tbody.appendChild(tr);
            } else {
                const tbody = tableProfessor.getElementsByTagName('tbody')[0];

                professores.forEach(professor => {
                    const tr = document.createElement('tr');
                    const tdId = document.createElement('td');
                    const tdNome = document.createElement('td');
                    const tdCpf = document.createElement('td');
                    const tdEndereco = document.createElement('td');
                    const tdTelefone = document.createElement('td');
                    const tdStatus = document.createElement('td');

                    tdId.textContent = professor.idProfessor;
                    tdNome.textContent = capitalize(professor.nome);
                    tdCpf.textContent = formataCpf(professor.cpf);
                    tdEndereco.textContent = capitalize(professor.endereco);
                    tdTelefone.textContent = formataTelefone(professor.telefone);
                    tdStatus.textContent = capitalize(professor.status);

                    tr.appendChild(tdId);
                    tr.appendChild(tdNome);
                    tr.appendChild(tdCpf);
                    tr.appendChild(tdEndereco);
                    tr.appendChild(tdTelefone);
                    tr.appendChild(tdStatus);

                    tbody.appendChild(tr);
                });
            }
        }
    }

    async function inserirDisciplinas() {
        if(!idProfessor) {
            try {
                const response = await apiProfessor.pegarProfessores();

                if(response.status === 200) {
                    const professores = await response.json();

                    carregarTabela(professores);
                } else {
                    carregarTabela([], true);
                }
            } catch(error) {
                carregarTabela([], true);
            }
        } else {
            try {
                const response = await apiProfessor.pegarProfessor(idProfessor);

                if(response.status === 200) {
                    const professor = await response.json();
                    
                    carregarTabela([professor]);
                } else {
                    carregarTabela([], true);
                }
            } catch(error) {
                carregarTabela([], true);
            }
        }
    }

    async function main() {
        await inserirDisciplinas();
    } 

    main();
})();
