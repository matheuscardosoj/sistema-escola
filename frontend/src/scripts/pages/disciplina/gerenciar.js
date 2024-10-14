import ApiDisciplina from '../../api/apiDiciplina.js';

(async function() {
    const selectDisciplinas = document.getElementById('idDisciplina');
    const buttonInserir = document.getElementById('buttonInserir');
    const form = document.getElementsByClassName('form')[0];
    const apiDisciplina = new ApiDisciplina();

    async function inserirDisciplinas() {
        const response = await apiDisciplina.pegarDisciplinas();
        const disciplinas = await response.json();

        disciplinas.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina.idDisciplina;
            option.text = disciplina.nome;
            selectDisciplinas.appendChild(option);
        });
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', async () => {
            window.location.href = `http://localhost:5500/src/pages/disciplina/inserir.html`;
        });
    }

    async function main() {
        await inserirDisciplinas();
        executarListeners();
    }

    main();
})();
