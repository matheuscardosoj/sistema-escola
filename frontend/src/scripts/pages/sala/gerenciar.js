import ApiSala from '../../api/ApiSala.js';
import { mostrarMensagem, redirecionar, recarregarPagina, capitalize } from '../../utils/helpers.js';

(async function () {
    const inputPesquisar = document.getElementById('inputPesquisar');
    const buttonPesquisar = document.getElementById('buttonPesquisar');
    const selectSalas = document.getElementById('idSala');
    const buttonInserir = document.getElementById('buttonInserir');
    const buttonAlterar = document.getElementById('buttonAlterar');
    const buttonAtivarDesativar = document.getElementById('buttonAtivarDesativar');
    const buttonConsultar = document.getElementById('buttonConsultar');
    const checkboxInativos = document.getElementById('checkboxInativos');
    const divMensagem = document.getElementById('mensagem');
    const form = document.getElementsByClassName('form')[0];
    const apiSala = new ApiSala();

    function recarregarSelect(salas) {
        selectSalas.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.text = 'Selecione uma sala';
        selectSalas.appendChild(option);

        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.idSala;
            option.text = `${capitalize(sala.nome)} - ${capitalize(sala.status)}`;
            selectSalas.appendChild(option);
        });
    }

    async function inserirSalasAtivas() {
        try {
            const response = await apiSala.pegarSalasAtivas();

            const salas = await response.json();           

            recarregarSelect(salas);
        } catch(error) {            
            await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
        }
    }

    async function inserirSalas() {
        try {
            const response = await apiSala.pegarSalas();

            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
                return;
            }

            const salas = await response.json();

            recarregarSelect(salas);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
        }
    }

    async function inserirSalasFiltradas(filtro, mostrarInativas) {
        try {
            const response = await apiSala.pegarSalasFiltradas(filtro, mostrarInativas);
            
            if(response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
                return;
            }
            
            const salas = await response.json();

            recarregarSelect(salas);
        } catch(error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar salas', true);
        }
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {           
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', () => {
            redirecionar('http://localhost/src/pages/sala/inserir.html');
        });

        buttonConsultar.addEventListener('click', () => {
            const idSala = selectSalas.value;

            if(idSala) {
                redirecionar(`http://localhost/src/pages/sala/consultar.html?idSala=${idSala}`);
            } else {
                redirecionar(`http://localhost/src/pages/sala/consultar.html`);
            }
        });

        checkboxInativos.addEventListener('change', async () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(checkboxInativos.checked) {
                await inserirSalas();
            } else {
                await inserirSalasAtivas();
            }

            buttonAtivarDesativar.style.display = 'none';
            buttonAlterar.style.display = 'none';
            
            buttons.classList.add('buttons--right');
        });

        selectSalas.addEventListener('change', () => {
            const buttons = buttonAtivarDesativar.parentElement;

            if(!selectSalas.value) {
                buttonAtivarDesativar.style.display = 'none';
                buttonAlterar.style.display = 'none';

                buttons.classList.add('buttons--right');
                return;
            }
            
            const option = selectSalas.options[selectSalas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();
            buttonAtivarDesativar.style.display = 'block';
            buttonAlterar.style.display = 'block';

            buttonAtivarDesativar.textContent = status === 'ativo' ? 'Desativar' : 'Ativar';
            buttons.classList.remove('buttons--right'); 
        });

        buttonAtivarDesativar.addEventListener('click', async () => {
            const idSala = selectSalas.value;
            const option = selectSalas.options[selectSalas.selectedIndex];
            const status = option.text.split(' - ')[1].toLowerCase();

            let response;

            try {
                if(status === 'ativo') {
                    response = await apiSala.desativarSala(idSala);
                } else {
                    response = await apiSala.ativarSala(idSala);
                }

                if(response.status !== 200) {
                    await mostrarMensagem(divMensagem, 'Erro ao alterar status da sala', true);
                    return;
                }

                recarregarPagina();
            } catch(error) {
                console.log(error);
                await mostrarMensagem(divMensagem, 'Erro ao alterar status da sala', true);
            }
        });

        buttonPesquisar.addEventListener('click', async () => {
            const filtro = inputPesquisar.value ? inputPesquisar.value : '';
            const mostrarInativas = checkboxInativos.checked;

            await inserirSalasFiltradas(filtro, mostrarInativas);
        });

        buttonAlterar.addEventListener('click', () => {
            const idSala = selectSalas.value;

            redirecionar(`http://localhost/src/pages/sala/alterar.html?idSala=${idSala}`);
        });
    }

    async function main() {
        await inserirSalasAtivas();
        executarListeners();
    }

    main();
})();
