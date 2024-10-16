import ApiDisciplina from "../../api/apiDiciplina.js";

(async function() {
    const apiDisciplina = new ApiDisciplina();
    const form = document.getElementsByClassName('form')[0];
    const inputNomeDisciplina = document.getElementById('nomeDisciplina');
    const inputDescricaoDisciplina = document.getElementById('descricaoDisciplina');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const divMensagem = document.getElementById('mensagem');
    
    const urlParams = new URLSearchParams(window.location.search);
    const idDisciplina = urlParams.get('idDisciplina');
    

    if (!idDisciplina) {
        window.location.href = 'http://localhost/src/pages/disciplina/gerenciar.html';
    }

    async function preencherCampos() {
        const response = await apiDisciplina.pegarDisciplina(idDisciplina);
        
        if (response.status !== 200) {
            divMensagem.innerText = 'Erro ao buscar disciplina';
            divMensagem.classList.remove('mensagem--hidden');
            divMensagem.classList.remove('mensagem--sucesso');
            divMensagem.classList.add('mensagem--error');
            return;
        }

        const disciplina = await response.json();
        inputNomeDisciplina.value = disciplina.nome;
        inputDescricaoDisciplina.value = disciplina.descricao;
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonEnviar.addEventListener('click', async () => {
            const nome = inputNomeDisciplina.value;
            const descricao = inputDescricaoDisciplina.value;

            const response = await apiDisciplina.alterarDisciplina(idDisciplina, nome, descricao);

            if(response.status === 200) {
                divMensagem.classList.add('mensagem--success');
                divMensagem.classList.remove('mensagem--error');
                divMensagem.innerHTML = 'Disciplina alterada com sucesso';
            } else {
                divMensagem.classList.remove('mensagem--success');
                divMensagem.classList.add('mensagem--error');
                divMensagem.innerHTML = 'Erro ao alterar a disciplina';
            }

            divMensagem.classList.remove('mensagem--hidden');

            setTimeout(() => {
                divMensagem.classList.add('mensagem--hidden');
            }, 5000);

            window.location.href = `http://localhost/src/pages/disciplina/consultar.html?idDisciplina=${idDisciplina}`;
        });
    }

    async function main() {
        await preencherCampos();
        executarListeners();
    }

    main();
})();
