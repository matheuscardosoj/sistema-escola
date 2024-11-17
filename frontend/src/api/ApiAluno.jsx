class ApiAluno {
    #url = 'http://localhost:5050/aluno';

    async pegarAlunos() {
        const response = await fetch(this.#url);
        
        return response;
    }

    async pegarAlunosAtivos() {
        const response = await fetch(`${this.#url}/actives`);

        return response;
    }

    async pegarAlunosInativos() {
        const response = await fetch(`${this.#url}/inactives`);

        return response;
    }

    async pegarAlunosFiltrados(filtro, mostrar) {
        const response = await fetch(`${this.#url}/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ filtro, mostrar })
        });

        return response;
    }

    async criarAluno(nome, cpf, endereco, telefone) {
        const response = await fetch(`${this.#url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cpf, endereco, telefone })
        });

        return response;
    }

    async pegarAluno(idAluno) {
        const response = await fetch(`${this.#url}/${idAluno}`);

        return response;
    }

    async ativarAluno(idAluno) {
        const response = await fetch(`${this.#url}/activate/${idAluno}`, {
            method: 'PUT'
        });

        return response;
    }

    async desativarAluno(idAluno) {
        const response = await fetch(`${this.#url}/disable/${idAluno}`, {
            method: 'PUT'
        });

        return response;
    }

    async alterarAluno(idAluno, nome, cpf, endereco, telefone) {
        const response = await fetch(`${this.#url}/update/${idAluno}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cpf, endereco, telefone })
        });

        return response;
    }
}

export default ApiAluno;
