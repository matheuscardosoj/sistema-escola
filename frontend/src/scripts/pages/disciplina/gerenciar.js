import ApiDisciplina from '../../api/ApiDisciplina.js';
import { mostrarMensagem, redirecionar, recarregarPagina, capitalize } from '../../utils/helpers.js';

(async function () {
    const inputPesquisar = document.getElementById('inputPesquisar');
    const buttonPesquisar = document.getElementById('buttonPesquisar');
    const selectDisciplinas = document.getElementById('idDisciplina');
    const buttonInserir = document.getElementById('buttonInserir');
    const buttonAlterar = document.getElementById('buttonAlterar');
    const buttonAtivarDesativar = document.getElementById('buttonAtivarDesativar');
    const buttonConsultar = document.getElementById('buttonConsultar');
    const checkboxInativos = document.getElementById('checkboxInativos');
    const divMensagem = document.getElementById('mensagem');
    const form = document.getElementsByClassName('form')[0];
    const apiDisciplina = new ApiDisciplina();

    function recarregarSelect(diciplinas) {
        selectDisciplinas.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Selecione uma disciplina';
        selectDisciplinas.appendChild(option);

        diciplinas.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina.idDisciplina;
            option.text = `${capitalize(disciplina.nome)} - ${capitalize(disciplina.status)}`;
            selectDisciplinas.appendChild(option);
        });
    }

    async function inserirDisciplinasAtivas() {
        try {
            const response = await apiDisciplina.pegarDisciplinasAtivas();

            const disciplinas = await response.json();           

            recarregarSelect(disciplinas);
        } catch(error) {       
            await mostrarMensagem(divMensagem, 'Erro ao buscar disciplinas', true);
        }
    }

    async function inserirDisciplinas() {
        try {
            const response = await apiDisciplina.pegarDisciplinas();

            if(response.status !== 200) {
                const { error } = await response.json();

                await mostrarMensagem(divMensagem, error || 'Erro ao buscar disciplinas', true);
                return;
            }

            const disciplinas = await response.json();

            recarregarSelect(disciplinas);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar disciplinas', true);
        }
    }

    async function inserirDisciplinasFiltradas(filtro, mostrarInativas) {
        try {
            const response = await apiDisciplina.pegarDisciplinasFiltradas(filtro, mostrarInativas);
            
            if(response.status !== 200) {
                const { error } = await response.json();

                await mostrarMensagem(divMensagem, error || 'Erro ao buscar disciplinas', true);
                return;
            }
            
            const disciplinas = await response.json();

            recarregarSelect(disciplinas);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar disciplinas', true);
        }
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {           
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', () => {
            redirecionar('http://localhost/src/pages/disciplina/inserir.html');
        });

        buttonConsultar.addEventListener('click', () => {
            const idDisciplina = selectDisciplinas.value;

            if(idDisciplina) {
                redirecionar(`http://localhost/src/pages/disciplina/consultar.html?idDisciplina=${idDisciplina}`);
            } else {
                redirecionar(`http://localhost/src/pages/disciplina/consultar.html`);
            }
        });

        checkboxInativos.addEventListener('change', async () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(checkboxInativos.checked) {
                await inserirDisciplinas();
            } else {
                await inserirDisciplinasAtivas();
            }

            buttonAtivarDesativar.style.display = 'none';
            buttonAlterar.style.display = 'none';
            
            buttons.classList.add('buttons--right');
        });

        selectDisciplinas.addEventListener('change', () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(!selectDisciplinas.value) {
                buttonAtivarDesativar.style.display = 'none';
                buttonAlterar.style.display = 'none';

                buttons.classList.add('buttons--right');
                return;
            }
            
            const option = selectDisciplinas.options[selectDisciplinas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();
            buttonAtivarDesativar.style.display = 'block';
            buttonAlterar.style.display = 'block';

            buttonAtivarDesativar.textContent = status === 'ativo' ? 'Desativar' : 'Ativar';
            buttons.classList.remove('buttons--right'); 
        });

        buttonAtivarDesativar.addEventListener('click', async () => {
            const idDisciplina = selectDisciplinas.value;
            const option = selectDisciplinas.options[selectDisciplinas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();

            let response;

            try {
                if(status === 'ativo') {
                    response = await apiDisciplina.desativarDisciplina(idDisciplina);
                } else {
                    response = await apiDisciplina.ativarDisciplina(idDisciplina);
                }

                if(response.status !== 200) {
                    const { error } = await response.json();

                    await mostrarMensagem(divMensagem, error || 'Erro ao alterar status da disciplina', true);
                    return;
                }

                recarregarPagina();
            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao alterar status da disciplina', true);
            }
        });

        buttonPesquisar.addEventListener('click', async () => {
            const filtro = inputPesquisar.value ? inputPesquisar.value : '';
            const mostrarInativas = checkboxInativos.checked;

            await inserirDisciplinasFiltradas(filtro, mostrarInativas);
        });

        buttonAlterar.addEventListener('click', () => {
            const idDisciplina = selectDisciplinas.value;

            redirecionar(`http://localhost/src/pages/disciplina/alterar.html?idDisciplina=${idDisciplina}`);
        });
    }

    async function main() {
        await inserirDisciplinasAtivas();
        executarListeners();
    }

    main();
})();
