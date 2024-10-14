import ApiDisciplina from '../../api/apiDiciplina.js';

(async function() {
    const nomeDisciplina = document.getElementById('nomeDisciplina');
    const descricaoDisciplina = document.getElementById('descricaoDisciplina');
    const divMensagem = document.getElementById('mensagem');
    const buttonInserir = document.getElementById('buttonInserir');
    const form = document.getElementsByClassName('form')[0];
    const apiDisciplina = new ApiDisciplina();
    
    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonInserir.addEventListener('click', async () => {
            const nome = nomeDisciplina.value;
            const descricao = descricaoDisciplina.value;

            const response = await apiDisciplina.criarDisciplina(nome, descricao);

            if(response.status === 200) {
                divMensagem.innerHTML = 'Disciplina criada com sucesso';
            } else {
                divMensagem.innerHTML = 'Erro ao criar a disciplina';
            }

            setInterval(() => {
                window.location.href = `http://localhost:5500/src/pages/disciplina/consultar.html`;
            }, 5000);
        });
    }

    async function main() {
        executarListeners();
    }

    main();
})();
