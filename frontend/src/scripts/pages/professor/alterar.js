import ApiProfessor from "../../api/ApiProfessor.js";
import { formataCpf, formataTelefone, mostrarMensagem, redirecionar, retirarMascaraCpf, retirarMascaraTelefone } from "../../utils/helpers.js";

(async function() {
    const apiProfessor = new ApiProfessor();
    const form = document.getElementsByClassName('form')[0];
    const inputNomeProfessor = document.getElementById('nomeProfessor');
    const inputCpfProfessor = document.getElementById('cpfProfessor');
    const inputEnderecoProfessor = document.getElementById('enderecoProfessor');
    const inputTelefoneProfessor = document.getElementById('telefoneProfessor');
    const buttonEnviar = document.getElementById('buttonEnviar');
    const divMensagem = document.getElementById('mensagem');
    
    const urlParams = new URLSearchParams(window.location.search);
    const idProfessor = urlParams.get('idProfessor');
    
    if (!idProfessor) {
        redirecionar('http://localhost/src/pages/professor/gerenciar.html');
    }

    async function preencherCampos() {
        try {
            const response = await apiProfessor.pegarProfessor(idProfessor);
            
            if (response.status !== 200) {
                await mostrarMensagem(divMensagem, 'Erro ao buscar o professor', true);
                return;
            }

            const professor = await response.json();
            inputNomeProfessor.value = professor.nome;
            inputCpfProfessor.value = formataCpf(professor.cpf);
            inputEnderecoProfessor.value = professor.endereco;
            inputTelefoneProfessor.value = formataTelefone(professor.telefone);
        } catch (error) {
            await mostrarMensagem(divMensagem, 'Erro ao buscar o professor', true);
        }
    }

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
            try{
                const nome = inputNomeProfessor.value;
                const cpf = retirarMascaraCpf(inputCpfProfessor.value);
                const endereco = inputEnderecoProfessor.value;
                const telefone = retirarMascaraTelefone(inputTelefoneProfessor.value);

                if(!nome || !cpf || !endereco || !telefone) {
                    await mostrarMensagem(divMensagem, 'Preencha todos os campos', true);
                    return;
                }

                const response = await apiProfessor.alterarProfessor(idProfessor, nome, cpf, endereco, telefone);              

                if(response.status !== 200) {
                    console.log(response);
                    
                    await mostrarMensagem(divMensagem, 'Erro ao alterar o professor', true);
                    return;
                }

                await mostrarMensagem(divMensagem, 'Professor alterado com sucesso');

                redirecionar(`http://localhost/src/pages/professor/consultar.html?idProfessor=${idProfessor}`, 5000);
            } catch(error) {
                console.log(error);
                
                await mostrarMensagem(divMensagem, 'Erro ao alterar o professor', true);
            }
        });
    }

    async function main() {
        await preencherCampos();
        executarListeners();
    }

    main();
})();
