import ApiDisciplina from "../../api/apiDiciplina.js";
import { mostrarMensagem, redirecionar } from "../../utils/helpers.js";

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
        redirecionar('http://localhost/src/pages/disciplina/gerenciar.html');
    }

    async function preencherCampos() {
        try {
            const response = await apiDisciplina.pegarDisciplina(idDisciplina);
            
            if (response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar a disciplina', true);
                return;
            }

            const disciplina = await response.json();
            inputNomeDisciplina.value = disciplina.nome;
            inputDescricaoDisciplina.value = disciplina.descricao;
        } catch (error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar a disciplina', true);
        }
    }

    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        buttonEnviar.addEventListener('click', async () => {
            try{
                const nome = inputNomeDisciplina.value;
                const descricao = inputDescricaoDisciplina.value;

                const response = await apiDisciplina.alterarDisciplina(idDisciplina, nome, descricao);               

                if(response.status !== 200) {
                    await mostrarMensagem(divMensagem, 'Erro ao alterar a disciplina', true);
                    return;
                }

                await mostrarMensagem(divMensagem, 'Disciplina alterada com sucesso');

                redirecionar(`http://localhost/src/pages/disciplina/consultar.html?idDisciplina=${idDisciplina}`, 5000);
            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao alterar a disciplina', true);
            }
        });
    }

    async function main() {
        await preencherCampos();
        executarListeners();
    }

    main();
})();
