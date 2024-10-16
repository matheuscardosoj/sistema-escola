export async function mostrarMensagem(divMensagem ,mensagem, erro = false) {
    divMensagem.textContent = mensagem;
    divMensagem.classList.remove('mensagem--hidden');

    if(erro) {
        divMensagem.classList.add('mensagem--error');
        divMensagem.classList.remove('mensagem--success');
    } else {
        divMensagem.classList.remove('mensagem--error');
        divMensagem.classList.add('mensagem--success');
    }

    setTimeout(() => {
        divMensagem.classList.add('mensagem--hidden');
    }, 5000);
}

export async function redirecionar(url, tempo = 0) {
    setTimeout(() => {
        window.location.href = url;
    }, tempo);
}

export async function recarregarPagina() {
    window.location.reload();
}
