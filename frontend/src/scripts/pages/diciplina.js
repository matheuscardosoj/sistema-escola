(async () => {
    const api = "http://localhost:5050/";
    const selectElement = document.getElementById("selectDisciplinas");
    const buttonConsultar = document.getElementById("buttonConsultar");

    async function getDisciplinas() {
        const response = await fetch(api + "disciplina");
        const data = await response.json();
        return data;
    }

    async function inserirDisciplinas() {
        const disciplinas = await getDisciplinas();

        disciplinas.forEach((disciplina) => {
            const option = document.createElement("option");
            option.value = disciplina.idDisciplina;
            option.text = disciplina.nome;
            selectElement.appendChild(option);
        });
    }

    function consultarDiciplina() {
        buttonConsultar.addEventListener("click", async () => {
            const idDisciplina = selectElement.value;

            console.log(idDisciplina);
            
            
            if(!idDisciplina) return;

            window.location.href = `consultar/index.html?id=${idDisciplina}`;
        });
    }

    async function main() {
        await inserirDisciplinas();
        consultarDiciplina();
    }

    main();
})();
