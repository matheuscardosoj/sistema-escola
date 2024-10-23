import ApiDisciplina from '../../api/ApiDisciplina.js';
import { mostrarMensagem } from '../../utils/helpers.js';

(async function() {
    const inputNomeDisciplina = document.getElementById('nomeDisciplina');
    const inputDescricaoDisciplina = document.getElementById('descricaoDisciplina');
    const divMensagem = document.getElementById('mensagem');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const form = document.getElementsByClassName('form')[0];
    const apiDisciplina = new ApiDisciplina();
    
    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonEnviar.addEventListener('click', async () => {
            try {
                const nome = inputNomeDisciplina.value;
                const descricao = inputDescricaoDisciplina.value;

                if(!nome || !descricao) {
                    await mostrarMensagem(divMensagem, 'Preencha todos os campos', true);
                    return;
                }

                const response = await apiDisciplina.criarDisciplina(nome, descricao);

                if(response.status !== 200) {
                    const { error } = await response.json();

                    await mostrarMensagem(divMensagem, error || 'Erro ao criar a disciplina', true);
                    return;
                }

                inputNomeDisciplina.value = '';
                inputDescricaoDisciplina.value = '';

                inputNomeDisciplina.focus();
                
                await mostrarMensagem(divMensagem, 'Disciplina criada com sucesso');

            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao criar a disciplina', true);
            }
        });
    }

    async function main() {
        executarListeners();
    }

    main();
})();
