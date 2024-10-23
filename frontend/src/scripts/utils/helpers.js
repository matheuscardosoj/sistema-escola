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

export function capitalize(texto) {
    texto = String(texto);
    let palavras = texto.split(' ');

    let palavrasCapitalizadas = palavras.map(palavra => {       
        if(palavra.length > 3) {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
        }

        return palavra;
    });

    return palavrasCapitalizadas.join(' ');
}

export function retirarMascaraCpf(cpf = '') {
    return cpf.replace(/\D/g, '');
}

export function formataCpf(cpf = '') {
    let cpfSemMascara = retirarMascaraCpf(cpf);   
    const tamanhoCpf = cpfSemMascara.length;

    let cpfEditavel;    

    if(tamanhoCpf > 11) {
        cpfSemMascara = cpfSemMascara.slice(0, 11);
    }

    if(tamanhoCpf > 9) {
        cpfEditavel = cpfSemMascara.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if(tamanhoCpf > 6) {
        cpfEditavel = cpfSemMascara.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if(tamanhoCpf > 3) {
        cpfEditavel = cpfSemMascara.replace(/(\d{3})(\d{1,2})/, '$1.$2');
    } else {
        cpfEditavel = cpfSemMascara;
    }
    
    return cpfEditavel;
}

export function retirarMascaraTelefone(telefone = '') {
    return telefone.replace(/\D/g, '');
}

export function formataTelefone(telefone = '') {
    let telefoneSemMascara = retirarMascaraTelefone(telefone);
    const tamanhoTelefone = telefoneSemMascara.length;

    let telefoneEditavel;

    if(tamanhoTelefone > 11) {
        telefoneSemMascara = telefoneSemMascara.slice(0, 11);
    }

    if(tamanhoTelefone > 10) {
        telefoneEditavel = telefoneSemMascara.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if(tamanhoTelefone > 6) {
        telefoneEditavel = telefoneSemMascara.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else if(tamanhoTelefone > 2) {
        telefoneEditavel = telefoneSemMascara.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    } else {
        telefoneEditavel = telefoneSemMascara;
    }

    return telefoneEditavel;
}

export function deixarApenasDigitos(texto = '') {
    return texto.replace(/\D/g, '');
}

export function formataDataParaAnoSemestre(ano, semestre) {
  return `${ano}/${semestre}`;
}
