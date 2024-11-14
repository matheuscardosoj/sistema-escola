import { useEffect } from "react";

export function insertMensagem(refMensagem, mensagem, success = true) {
    if(!refMensagem) return;

    if(!refMensagem.current) return;

    refMensagem.current.classList.remove("mensagem--hidden");
    refMensagem.current.textContent = mensagem;

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
