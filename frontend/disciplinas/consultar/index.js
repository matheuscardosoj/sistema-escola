(async () => {
    const url = "http://localhost:5050/disciplina/";
    const tableElement = document.getElementById("tableDisciplina");

    function getIdDisciplina() {
        const url = new URLSearchParams(window.location.search);

        return url.get("id");
    }

    async function getDisciplina(idDisciplina) {
        const response = await fetch(url + idDisciplina);
        const data = await response.json();
        return data;
    } 

    async function inserirDisciplina() {
        const idDisciplina = getIdDisciplina();
        const disciplina = await getDisciplina(idDisciplina);

        const tr = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdNome = document.createElement("td");
        const tdDescricao = document.createElement("td");
        const tdStatus = document.createElement("td");
        const tbody = tableElement.querySelector("tbody");

        tdId.textContent = disciplina.idDisciplina;
        tdNome.textContent = disciplina.nome;
        tdDescricao.textContent = disciplina.descricao;
        tdStatus.textContent = disciplina.status;

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdDescricao);
        tr.appendChild(tdStatus);

        tbody.appendChild(tr);

        tableElement.appendChild(tbody);
    }

    async function main() {
        await inserirDisciplina();
    }

    main();
})();
