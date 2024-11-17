class ApiSala {
    #url = 'http://localhost:5050/sala';

    async pegarSalas() {
        const response = await fetch(this.#url);
        
        return response;
    }

    async pegarSalasAtivas() {
        const response = await fetch(`${this.#url}/actives`);

        return response;
    }

    async pegarSalasInativas() {
        const response = await fetch(`${this.#url}/inactives`);

        return response;
    }

    async pegarSalasFiltradas(filtro, mostrar) {
        const response = await fetch(`${this.#url}/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ filtro, mostrar })
        });

        return response;
    }

    async criarSala(nome, local, capacidade) {
        const response = await fetch(`${this.#url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, local, capacidade })
        });

        return response;
    }

    async pegarSala(idSala) {
        const response = await fetch(`${this.#url}/${idSala}`);

        return response;
    }

    async ativarSala(idSala) {
        const response = await fetch(`${this.#url}/activate/${idSala}`, {
            method: 'PUT'
        });

        return response;
    }

    async desativarSala(idSala) {
        const response = await fetch(`${this.#url}/disable/${idSala}`, {
            method: 'PUT'
        });

        return response;
    }

    async alterarSala(idSala, nome, local, capacidade) {
        const response = await fetch(`${this.#url}/update/${idSala}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, local, capacidade })
        });

        return response;
    }
}

export default ApiSala;
