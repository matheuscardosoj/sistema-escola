class ApiProfessor {
    #url = 'http://localhost:5050/professor';

    async pegarProfessores() {
        const response = await fetch(this.#url);
        
        return response;
    }

    async pegarProfessoresAtivos() {
        const response = await fetch(`${this.#url}/actives`);

        return response;
    }

    async pegarProfessoresInativos() {
        const response = await fetch(`${this.#url}/inactives`);

        return response;
    }

    async pegarProfessoresFiltrados(filtro, mostrar) {
        const response = await fetch(`${this.#url}/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ filtro, mostrar })
        });

        return response;
    }

    async criarProfessor(nome, cpf, titulo, endereco, telefone) {
        const response = await fetch(`${this.#url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cpf, titulo, endereco, telefone })
        });

        return response;
    }

    async pegarProfessor(idProfessor) {
        const response = await fetch(`${this.#url}/${idProfessor}`);

        return response;
    }

    async ativarProfessor(idProfessor) {
        const response = await fetch(`${this.#url}/activate/${idProfessor}`, {
            method: 'PUT'
        });

        return response;
    }

    async desativarProfessor(idProfessor) {
        const response = await fetch(`${this.#url}/disable/${idProfessor}`, {
            method: 'PUT'
        });

        return response;
    }

    async alterarProfessor(idProfessor, nome, cpf, titulo, endereco, telefone) {
        const response = await fetch(`${this.#url}/update/${idProfessor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cpf, titulo, endereco, telefone })
        });

        return response;
    }
}

export default ApiProfessor;
