import ApiSala from '../../api/ApiSala.js';
import { mostrarMensagem } from '../../utils/helpers.js';

(async function() {
    const inputNomeSala = document.getElementById('nomeSala');
    const inputCapacidadeSala = document.getElementById('capacidadeSala');
    const divMensagem = document.getElementById('mensagem');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const form = document.getElementsByClassName('form')[0];
    const apiSala = new ApiSala();
    
    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonEnviar.addEventListener('click', async () => {
            try {
                const nome = inputNomeSala.value;
                const capacidade = inputCapacidadeSala.value;

                if(!nome || !capacidade) {
                    await mostrarMensagem(divMensagem, 'Preencha todos os campos', true);
                    return;
                }

                const response = await apiSala.criarSala(nome, capacidade);

                if(response.status !== 200) {
                    await mostrarMensagem(divMensagem, 'Erro ao criar a sala', true);
                    return;
                }

                inputNomeSala.value = '';
                inputCapacidadeSala.value = '';

                inputNomeSala.focus();
                
                await mostrarMensagem(divMensagem, 'Disciplina criada com sucesso');

            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao criar a sala', true);
            }
        });
    }

    async function main() {
        executarListeners();
    }

    main();
})();
