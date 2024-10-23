import ApiProfessor from '../../api/ApiProfessor.js';
import { formataCpf, formataTelefone, mostrarMensagem, retirarMascaraCpf, retirarMascaraTelefone } from '../../utils/helpers.js';

(async function() {
    const inputNomeProfessor = document.getElementById('nomeProfessor');
    const inputCpfProfessor = document.getElementById('cpfProfessor');
    const inputEnderecoProfessor = document.getElementById('enderecoProfessor');
    const inputTelefoneProfessor = document.getElementById('telefoneProfessor');
    const divMensagem = document.getElementById('mensagem');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const form = document.getElementsByClassName('form')[0];
    const apiProfessor = new ApiProfessor();
    
    function executarListeners() {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        });

        inputCpfProfessor.addEventListener('input', () => {
            inputCpfProfessor.value = formataCpf(inputCpfProfessor.value);
        });

        inputTelefoneProfessor.addEventListener('input', () => {
            inputTelefoneProfessor.value = formataTelefone(inputTelefoneProfessor.value);
        });

        buttonEnviar.addEventListener('click', async () => {
            try {
                const nome = inputNomeProfessor.value;
                const cpf = retirarMascaraCpf(inputCpfProfessor.value);
                const endereco = inputEnderecoProfessor.value;
                const telefone = retirarMascaraTelefone(inputTelefoneProfessor.value);

                if(!nome || !cpf || !endereco || !telefone) {
                    await mostrarMensagem(divMensagem, 'Preencha todos os campos', true);
                    return;
                }

                const response = await apiProfessor.criarProfessor(nome, cpf, endereco, telefone);

                if(response.status !== 200) {
                    const { error } = await response.json();

                    await mostrarMensagem(divMensagem, error || 'Erro ao criar a disciplina', true);
                    return;
                }

                inputNomeProfessor.value = '';
                inputCpfProfessor.value = '';
                inputEnderecoProfessor.value = '';
                inputTelefoneProfessor.value = '';

                inputNomeProfessor.focus();
                
                await mostrarMensagem(divMensagem, 'Professor criado com sucesso');

            } catch(error) {
                await mostrarMensagem(divMensagem, 'Erro ao criar o professor', true);
            }
        });
    }

    async function main() {
        executarListeners();
    }

    main();
})();
