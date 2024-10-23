import ApiTurma from '../../api/ApiTurma.js';
import { mostrarMensagem, redirecionar, recarregarPagina, capitalize } from '../../utils/helpers.js';

(async function () {
    const inputPesquisar = document.getElementById('inputPesquisar');
    const buttonPesquisar = document.getElementById('buttonPesquisar');
    const selectTurmas = document.getElementById('idTurma');
    const buttonInserir = document.getElementById('buttonInserir');
    const buttonAlterar = document.getElementById('buttonAlterar');
    const buttonAtivarDesativar = document.getElementById('buttonAtivarDesativar');
    const buttonConsultar = document.getElementById('buttonConsultar');
    const checkboxInativos = document.getElementById('checkboxInativos');
    const divMensagem = document.getElementById('mensagem');
    const form = document.getElementsByClassName('form')[0];
    const apiTurma = new ApiTurma();

    function recarregarSelect(turmas) {
        selectTurmas.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Selecione uma turma';
        selectTurmas.appendChild(option);

        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.idTurma;
            option.text = `${capitalize(turma.nome)} - ${capitalize(turma.status)}`;
            selectTurmas.appendChild(option);
        });
    }

    async function inserirTurmasAtivas() {
        try {
            const response = await apiTurma.pegarTurmasAtivas();

            const turmas = await response.json(); 
                      
            recarregarSelect(turmas);
        } catch(error) {                       
            await mostrarMensagem(divMensagem, 'Erro ao buscar turmas', true);
        }
    }

    async function inserirTurmas() {
        try {
            const response = await apiTurma.pegarTurmas();

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar turmas', true);
                return;
            }

            const turmas = await response.json();

            recarregarSelect(turmas);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar turmas', true);
        }
    }

    async function inserirTurmasFiltradas(filtro, mostrarInativas) {
        try {
            const response = await apiTurma.pegarTurmasFiltradas(filtro, mostrarInativas);
            
            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar turmas', true);
                return;
            }
            
            const turmas = await response.json();

            recarregarSelect(turmas);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar turmas', true);
        }
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {           
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', () => {
            redirecionar('http://localhost/src/pages/turma/inserir.html');
        });

        buttonConsultar.addEventListener('click', () => {
            const idTurma = selectTurmas.value;

            if(idTurma) {
                redirecionar(`http://localhost/src/pages/turma/consultar.html?idTurma=${idTurma}`);
            } else {
                redirecionar(`http://localhost/src/pages/turma/consultar.html`);
            }
        });

        checkboxInativos.addEventListener('change', async () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(checkboxInativos.checked) {
                await inserirTurmas();
            } else {
                await inserirTurmasAtivas();
            }

            buttonAtivarDesativar.style.display = 'none';
            buttonAlterar.style.display = 'none';
            
            buttons.classList.add('buttons--right');
        });

        selectTurmas.addEventListener('change', () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(!selectTurmas.value) {
                buttonAtivarDesativar.style.display = 'none';
                buttonAlterar.style.display = 'none';

                buttons.classList.add('buttons--right');
                return;
            }
            
            const option = selectTurmas.options[selectTurmas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();
            buttonAtivarDesativar.style.display = 'block';
            buttonAlterar.style.display = 'block';

            buttonAtivarDesativar.textContent = status === 'ativo' ? 'Desativar' : 'Ativar';
            buttons.classList.remove('buttons--right'); 
        });

        buttonAtivarDesativar.addEventListener('click', async () => {
            const idTurma = selectTurmas.value;
            const option = selectTurmas.options[selectTurmas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();

            let response;

            try {
                if(status === 'ativo') {
                    response = await apiTurma.desativarTurma(idTurma);
                } else {
                    response = await apiTurma.ativarTurma(idTurma);
                }

                if(response.status !== 200) {
                    const { error } = await response.json();

                    await mostrarMensagem(divMensagem, error || 'Erro ao alterar status da turma', true);
                    return;
                }

                recarregarPagina();
            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao alterar status da turma', true);
            }
        });

        buttonPesquisar.addEventListener('click', async () => {
            const filtro = inputPesquisar.value ? inputPesquisar.value : '';
            const mostrarInativas = checkboxInativos.checked;

            await inserirTurmasFiltradas(filtro, mostrarInativas);
        });

        buttonAlterar.addEventListener('click', () => {
            const idTurma = selectTurmas.value;

            redirecionar(`http://localhost/src/pages/turma/alterar.html?idTurma=${idTurma}`);
        });
    }

    async function main() {
        await inserirTurmasAtivas();
        executarListeners();
    }

    main();
})();
