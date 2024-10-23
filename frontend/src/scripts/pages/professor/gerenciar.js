import ApiProfessor from '../../api/ApiProfessor.js';
import { mostrarMensagem, redirecionar, recarregarPagina, capitalize } from '../../utils/helpers.js';

(async function () {
    const inputPesquisar = document.getElementById('inputPesquisar');
    const buttonPesquisar = document.getElementById('buttonPesquisar');
    const selectProfessor = document.getElementById('idProfessor');
    const buttonInserir = document.getElementById('buttonInserir');
    const buttonAlterar = document.getElementById('buttonAlterar');
    const buttonAtivarDesativar = document.getElementById('buttonAtivarDesativar');
    const buttonConsultar = document.getElementById('buttonConsultar');
    const checkboxInativos = document.getElementById('checkboxInativos');
    const divMensagem = document.getElementById('mensagem');
    const form = document.getElementsByClassName('form')[0];
    const apiProfessor = new ApiProfessor();

    function recarregarSelect(professores) {
        selectProfessor.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Selecione um professor';
        selectProfessor.appendChild(option);
        
        professores.forEach(professor => {
            const option = document.createElement('option');
            option.value = professor.idProfessor;
            option.text = `${capitalize(professor.nome)} - ${capitalize(professor.status)}`;
            selectProfessor.appendChild(option);
        });
    }

    async function inserirProfessoresAtivos() {      
        try {
            const response = await apiProfessor.pegarProfessoresAtivos();

            const professores = await response.json();           

            recarregarSelect(professores);
        } catch(error) {            
            await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
        }
    }

    async function inserirProfessores() {
        try {
            const response = await apiProfessor.pegarProfessores();

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
                return;
            }

            const professores = await response.json();

            recarregarSelect(professores);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
        }
    }

    async function inserirProfessoresFiltrados(filtro, mostrarInativas) {
        try {
            const response = await apiProfessor.pegarProfessoresFiltrados(filtro, mostrarInativas);
            
            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
                return;
            }
            
            const professores = await response.json();

            recarregarSelect(professores);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar professores', true);
        }
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {           
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', () => {
            redirecionar('http://localhost/src/pages/professor/inserir.html');
        });

        buttonConsultar.addEventListener('click', () => {
            const idProfessor = selectProfessor.value;

            if(idProfessor) {
                redirecionar(`http://localhost/src/pages/professor/consultar.html?idProfessor=${idProfessor}`);
            } else {
                redirecionar(`http://localhost/src/pages/professor/consultar.html`);
            }
        });

        checkboxInativos.addEventListener('change', async () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(checkboxInativos.checked) {
                await inserirProfessores();
            } else {
                await inserirProfessoresAtivos();
            }

            buttonAtivarDesativar.style.display = 'none';
            buttonAlterar.style.display = 'none';

            buttons.classList.add('buttons--right');
        });

        selectProfessor.addEventListener('change', () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(!selectProfessor.value) {
                buttonAtivarDesativar.style.display = 'none';
                buttonAlterar.style.display = 'none';

                buttons.classList.add('buttons--right');
                return;
            }
            
            const option = selectProfessor.options[selectProfessor.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();
            buttonAtivarDesativar.style.display = 'block';
            buttonAlterar.style.display = 'block';

            buttonAtivarDesativar.textContent = status === 'ativo' ? 'Desativar' : 'Ativar';
            buttons.classList.remove('buttons--right'); 
        });

        buttonAtivarDesativar.addEventListener('click', async () => {
            const idProfessor = selectProfessor.value;
            console.log(selectProfessor);
            const option = selectProfessor.options[selectProfessor.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();

            let response;

            try {
                if(status === 'ativo') {
                    response = await apiProfessor.desativarProfessor(idProfessor)
                } else {
                    response = await apiProfessor.ativarProfessor(idProfessor);
                }

                if(response.status !== 200) {
                    await mostrarMensagem(divMensagem, 'Erro ao alterar status do professor', true);
                    return;
                }

                recarregarPagina();
            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao alterar status do professor', true);
            }
        });

        buttonPesquisar.addEventListener('click', async () => {
            const filtro = inputPesquisar.value ? inputPesquisar.value : '';
            const mostrarInativas = checkboxInativos.checked;
            
            await inserirProfessoresFiltrados(filtro, mostrarInativas);
        });

        buttonAlterar.addEventListener('click', () => {
            const idProfessor = selectProfessor.value;

            redirecionar(`http://localhost/src/pages/professor/alterar.html?idProfessor=${idProfessor}`);
        });
    }

    async function main() {
        await inserirProfessoresAtivos();
        executarListeners();
    }

    main();
})();
