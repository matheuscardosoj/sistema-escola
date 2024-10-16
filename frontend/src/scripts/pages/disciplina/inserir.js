import ApiDisciplina from '../../api/apiDiciplina.js';

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
            const nome = inputNomeDisciplina.value;
            const descricao = inputDescricaoDisciplina.value;

            const response = await apiDisciplina.criarDisciplina(nome, descricao);

            inputNomeDisciplina.value = '';
            inputDescricaoDisciplina.value = '';

            inputNomeDisciplina.focus();

            divMensagem.classList.remove('mensagem--hidden');

            if(response.status === 200) {
                divMensagem.classList.add('mensagem--success');
                divMensagem.classList.remove('mensagem--error');
                divMensagem.innerHTML = 'Disciplina criada com sucesso';
            } else {
                divMensagem.classList.remove('mensagem--success');
                divMensagem.classList.add('mensagem--error');
                divMensagem.innerHTML = 'Erro ao criar a disciplina';
            }

            setTimeout(async () => {
                divMensagem.classList.add('mensagem--hidden');
            }, 5000);
        });
    }

    async function main() {
        executarListeners();
    }

    main();
})();
