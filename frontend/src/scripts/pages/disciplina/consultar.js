import ApiDisciplina from "../../api/apiDiciplina.js";

(async function() {
    const tableDisciplina = document.getElementById('tableDisciplina');
    const apiDisciplina = new ApiDisciplina();
    const searchParams = new URLSearchParams(window.location.search);
    const idDisciplina = searchParams.get('idDisciplina');

    async function inserirDisciplinas() {
        if(!idDisciplina) {
            try {
                const response = await apiDisciplina.pegarDisciplinas();

                if(response.status === 200) {
                    const disciplinas = await response.json();
                    const tbody = tableDisciplina.getElementsByTagName('tbody')[0];

                    disciplinas.forEach(disciplina => {
                        const tr = document.createElement('tr');
                        const tdId = document.createElement('td');
                        const tdNome = document.createElement('td');
                        const tdDescricao = document.createElement('td');
                        const tdStatus = document.createElement('td');

                        tdId.textContent = disciplina.idDisciplina;
                        tdNome.textContent = disciplina.nome;
                        tdDescricao.textContent = disciplina.descricao;
                        tdStatus.textContent = disciplina.status;

                        tr.appendChild(tdId);
                        tr.appendChild(tdNome);
                        tr.appendChild(tdDescricao);
                        tr.appendChild(tdStatus);

                        tbody.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = 4;
                    td.textContent = 'Erro ao buscar as disciplinas';

                    tr.appendChild(td);

                    tableDisciplina.appendChild(tr);
                }
            } catch(error) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 4;
                td.textContent = 'Erro ao buscar as disciplinas';

                tr.appendChild(td);

                tableDisciplina.appendChild(tr);
            }
        } else {
            try {
                const response = await apiDisciplina.pegarDisciplina(idDisciplina);

                if(response.status === 200) {
                    const disciplina = await response.json();
                    const tbody = tableDisciplina.getElementsByTagName('tbody')[0];
                    const tr = document.createElement('tr');
                    const tdId = document.createElement('td');
                    const tdNome = document.createElement('td');
                    const tdDescricao = document.createElement('td');
                    const tdStatus = document.createElement('td');

                    tdId.textContent = disciplina.idDisciplina;
                    tdNome.textContent = disciplina.nome;
                    tdDescricao.textContent = disciplina.descricao;
                    tdStatus.textContent = disciplina.status;

                    tr.appendChild(tdId);
                    tr.appendChild(tdNome);
                    tr.appendChild(tdDescricao);
                    tr.appendChild(tdStatus);

                    tbody.appendChild(tr);
                } else {
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = 4;
                    td.textContent = 'Erro ao buscar a disciplina';

                    tr.appendChild(td);

                    tableDisciplina.appendChild(tr);
                }
            } catch(error) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 4;
                td.textContent = 'Erro ao buscar a disciplina';

                tr.appendChild(td);

                tableDisciplina.appendChild(tr);
            }
        }
    }

    async function main() {
        await inserirDisciplinas();
    } 

    main();
})();
