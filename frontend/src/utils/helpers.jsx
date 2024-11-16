import { useEffect } from "react";

export function insertMensagem(refMensagem, mensagens, success = true) {
    if(!refMensagem) return;

    if(!refMensagem.current) return;

    refMensagem.current.classList.remove("mensagem--hidden");

    if(Array.isArray(mensagens)) {
        refMensagem.current.innerHTML = mensagens.map(mensagem => `<p>${mensagem}</p>`).join("");
    } else {
        refMensagem.current.innerHTML = `<p>${mensagens}</p>`;
    }

    refMensagem.current.classList.add(success ? "mensagem--success" : "mensagem--error");

    setTimeout(() => {
        refMensagem.current.textContent = "";
        refMensagem.current.classList.remove("mensagem--success");
        refMensagem.current.classList.remove("mensagem--error");
        refMensagem.current.classList.add("mensagem--hidden");
    }, 5000);
}

export function insertMensagemWithNavigate(refMensagem, mensagem, success = true, path = "/") {
    insertMensagem(refMensagem, mensagem, success);

    setTimeout(() => {
        window.location.href = path;
    }, 5000);
}


export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}

export function formataCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length > 11) cpf = cpf.substring(0, 11);

    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    return cpf;
}

export function formataTelefone(telefone) {
    telefone = telefone.replace(/\D/g, "");

    if (telefone.length > 11) telefone = telefone.substring(0, 11); 
    
    if (telefone.length > 10) {
        telefone = telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
    } else if (telefone.length > 6) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    } else if (telefone.length > 2) {
        telefone = telefone.replace(/(\d{2})(\d{1,5})/, "($1) $2");
    } else if (telefone.length > 0) {
        telefone = telefone.replace(/(\d{1,2})/, "($1");
    }

    return telefone;
}

export function removeMask(value) {
    return value.replace(/\D/g, "");
}
