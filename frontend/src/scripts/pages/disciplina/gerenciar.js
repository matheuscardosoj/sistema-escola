import ApiDisciplina from '../../api/apiDiciplina.js';

(async function() {
    const selectDisciplinas = document.getElementById('idDisciplina');
    const buttonInserir = document.getElementById('buttonInserir');
    const buttonAlterar = document.getElementById('buttonAlterar');
    const buttonAtivarDesativar = document.getElementById('buttonAtivarDesativar');
    const buttonConsultar = document.getElementById('buttonConsultar');
    const checkboxInativos = document.getElementById('checkboxInativos');
    const divMensagem = document.getElementById('mensagem');
    const form = document.getElementsByClassName('form')[0];
    const apiDisciplina = new ApiDisciplina();

    async function inserirDisciplinasAtivas() {
        const response = await apiDisciplina.pegarDisciplinasAtivas();
        const disciplinas = await response.json();

        disciplinas.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina.idDisciplina;
            option.text = `${disciplina.nome} - ${disciplina.status.toUpperCase()}`;
            selectDisciplinas.appendChild(option);
        });
    }

    async function inserirDisciplinas() {
        const response = await apiDisciplina.pegarDisciplinas();
        const disciplinas = await response.json();

        disciplinas.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina.idDisciplina;
            option.text = `${disciplina.nome} - ${disciplina.status.toUpperCase()}`;
            selectDisciplinas.appendChild(option);
        });
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', () => {
            window.location.href = `http://localhost/src/pages/disciplina/inserir.html`;
        });

        buttonConsultar.addEventListener('click', () => {
            const idDisciplina = selectDisciplinas.value;

            if(idDisciplina) {
                window.location.href = `http://localhost/src/pages/disciplina/consultar.html?idDisciplina=${idDisciplina}`;
            } else {
                window.location.href = `http://localhost/src/pages/disciplina/consultar.html`;
            }
        });

        checkboxInativos.addEventListener('change', async () => {
            selectDisciplinas.innerHTML = '';
            const option = document.createElement('option');
            option.value = '';
            option.text = 'Selecione uma disciplina';
            selectDisciplinas.appendChild(option);

            if(checkboxInativos.checked) {
                await inserirDisciplinas();
            } else {
                await inserirDisciplinasAtivas();
            }

            buttonAtivarDesativar.style.display = 'none';
            buttonAlterar.style.display = 'none';
        });

        selectDisciplinas.addEventListener('change', () => {
            buttonAtivarDesativar.style.display = selectDisciplinas.value ? 'block' : 'none';
            buttonAlterar.style.display = selectDisciplinas.value ? 'block' : 'none';

            if(selectDisciplinas.value) {
                const option = selectDisciplinas.options[selectDisciplinas.selectedIndex];
                const status = option.text.split(' - ')[1].toLowerCase();

                buttonAtivarDesativar.textContent = status === 'ativo' ? 'Desativar' : 'Ativar';
            }
        });

        buttonAtivarDesativar.addEventListener('click', async () => {
            const idDisciplina = selectDisciplinas.value;
            const option = selectDisciplinas.options[selectDisciplinas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();

            if(status === 'ativo') {
                await apiDisciplina.desativarDisciplina(idDisciplina);
            } else {
                await apiDisciplina.ativarDisciplina(idDisciplina);
            }

            window.location.reload();
        });

        buttonAlterar.addEventListener('click', () => {
            const idDisciplina = selectDisciplinas.value;

            window.location.href = `http://localhost/src/pages/disciplina/alterar.html?idDisciplina=${idDisciplina}`;
        });
    }

    async function main() {
        await inserirDisciplinasAtivas();
        executarListeners();
    }

    main();
})();
