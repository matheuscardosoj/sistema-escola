import ApiSala from "../../api/ApiSala.js";
import { capitalize } from "../../utils/helpers.js";

(async function() {
    const tableSala = document.getElementById('tableSala');
    const apiSala = new ApiSala();
    const searchParams = new URLSearchParams(window.location.search);
    const idSala = searchParams.get('idSala');

    function carregarTabela(salas, erro = false) {
        if(erro) {
            const tbody = tableSala.getElementsByTagName('tbody')[0];

            const tr = document.createElement('tr');
            const td = document.createElement('td');

            td.colSpan = 4;
            td.textContent = 'Erro ao buscar as salas';
            
            tr.appendChild(td);

            tbody.appendChild(tr); 
        } else {
            if(salas.length === 0) {
                const tbody = tableSala.getElementsByTagName('tbody')[0];

                const tr = document.createElement('tr');
                const td = document.createElement('td');

                td.colSpan = 4;
                td.textContent = 'Nenhuma sala encontrada';

                tr.appendChild(td);

                tbody.appendChild(tr);
            } else {
                const tbody = tableSala.getElementsByTagName('tbody')[0];

                salas.forEach(sala => {
                    const tr = document.createElement('tr');
                    const tdId = document.createElement('td');
                    const tdNome = document.createElement('td');
                    const tdCapacidade = document.createElement('td');
                    const tdStatus = document.createElement('td');

                    tdId.textContent = sala.idSala;
                    tdNome.textContent = capitalize(sala.nome);
                    tdCapacidade.textContent = sala.capacidade;
                    tdStatus.textContent = capitalize(sala.status);

                    tr.appendChild(tdId);
                    tr.appendChild(tdNome);
                    tr.appendChild(tdCapacidade);
                    tr.appendChild(tdStatus);

                    tbody.appendChild(tr);
                });
            }
        }
    }

    async function inserirSalas() {
        if(!idSala) {
            try {
                const response = await apiSala.pegarSalas();

                if(response.status === 200) {
                    const salas = await response.json();

                    carregarTabela(salas);
                } else {
                    carregarTabela([], true);
                }
            } catch(error) {
                carregarTabela([], true);
            }
        } else {
            try {
                const response = await apiSala.pegarSala(idSala);

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
        await inserirSalas();
    } 

    main();
})();
