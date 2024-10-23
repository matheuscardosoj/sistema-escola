import ApiDisciplina from "../../api/ApiDisciplina.js";
import { capitalize } from "../../utils/helpers.js";

(async function() {
    const tableDisciplina = document.getElementById('tableDisciplina');
    const apiDisciplina = new ApiDisciplina();
    const searchParams = new URLSearchParams(window.location.search);
    const idDisciplina = searchParams.get('idDisciplina');

    function carregarTabela(disciplinas, erro = false) {
        if(erro) {
            const tbody = tableDisciplina.getElementsByTagName('tbody')[0];

            const tr = document.createElement('tr');
            const td = document.createElement('td');

            td.colSpan = 4;
            td.textContent = 'Erro ao buscar as disciplinas';

            tr.appendChild(td);

            tbody.appendChild(tr); 
        } else {
            if(disciplinas.length === 0) {
                const tbody = tableDisciplina.getElementsByTagName('tbody')[0];

                const tr = document.createElement('tr');
                const td = document.createElement('td');

                td.colSpan = 4;
                td.textContent = 'Nenhuma disciplina encontrada';

                tr.appendChild(td);

                tbody.appendChild(tr);
            } else {
                const tbody = tableDisciplina.getElementsByTagName('tbody')[0];

                disciplinas.forEach(disciplina => {
                    const tr = document.createElement('tr');
                    const tdId = document.createElement('td');
                    const tdNome = document.createElement('td');
                    const tdDescricao = document.createElement('td');
                    const tdStatus = document.createElement('td');

                    tdId.textContent = disciplina.idDisciplina;
                    tdNome.textContent = capitalize(disciplina.nome);
                    tdDescricao.textContent = capitalize(disciplina.descricao);
                    tdStatus.textContent = capitalize(disciplina.status);

                    tr.appendChild(tdId);
                    tr.appendChild(tdNome);
                    tr.appendChild(tdDescricao);
                    tr.appendChild(tdStatus);

                    tbody.appendChild(tr);
                });
            }
        }
    }

    async function inserirDisciplinas() {
        if(!idDisciplina) {
            try {
                const response = await apiDisciplina.pegarDisciplinas();

                if(response.status === 200) {
                    const disciplinas = await response.json();

                    carregarTabela(disciplinas);
                } else {
                    carregarTabela([], true);
                }
            } catch(error) {
                carregarTabela([], true);
            }
        } else {
            try {
                const response = await apiDisciplina.pegarDisciplina(idDisciplina);

                if(response.status === 200) {
                    const disciplina = await response.json();
                    
                    carregarTabela([disciplina]);
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
