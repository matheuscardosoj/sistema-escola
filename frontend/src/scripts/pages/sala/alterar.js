import ApiSala from "../../api/ApiSala.js";
import { mostrarMensagem, redirecionar } from "../../utils/helpers.js";

(async function() {
    const apiSala = new ApiSala();
    const form = document.getElementsByClassName('form')[0];
    const inputNomeSala = document.getElementById('nomeSala');
    const inputCapacidadeSala = document.getElementById('capacidadeSala');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const divMensagem = document.getElementById('mensagem');
    
    const urlParams = new URLSearchParams(window.location.search);
    const idSala = urlParams.get('idSala');
    
    if (!idSala) {
        redirecionar('http://localhost/src/pages/sala/gerenciar.html');
    }

    async function preencherCampos() {
        try {
            const response = await apiSala.pegarSala(idSala);
            
            if (response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar a sala', true);
                return;
            }

            const sala = await response.json();
            
            inputNomeSala.value = sala.nome;
            inputCapacidadeSala.value = sala.capacidade;
        } catch (error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar a sala', true);
        }
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonEnviar.addEventListener('click', async () => {
            try{
                const nome = inputNomeSala.value;
                const capacidade = inputCapacidadeSala.value;

                const response = await apiSala.alterarSala(idSala, nome, capacidade);               

                if(response.status !== 200) {
                    await mostrarMensagem(divMensagem, 'Erro ao alterar a sala', true);
                    return;
                }

                await mostrarMensagem(divMensagem, 'Sala alterada com sucesso');

                redirecionar(`http://localhost/src/pages/sala/consultar.html?idSala=${idSala}`, 5000);
            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao alterar a sala', true);
            }
        });
    }

    async function main() {
        await preencherCampos();
        executarListeners();
    }

    main();
})();
