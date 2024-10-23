class ApiDisciplina {
    #url = 'http://localhost:5050/disciplina';

    async pegarDisciplinas() {
        const response = await fetch(this.#url);
        
        return response;
    }

    async pegarDisciplinasAtivas() {
        const response = await fetch(`${this.#url}/actives`);

        return response;
    }

    async pegarDisciplinasFiltradas(filtro, mostrarInativas) {
        const response = await fetch(`${this.#url}/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ filtro, mostrarInativas })
        });

        return response;
    }

    async criarDisciplina(nome, descricao) {
        const response = await fetch(`${this.#url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, descricao })
        });

        return response;
    }

    async pegarDisciplina(idDisciplina) {
        const response = await fetch(`${this.#url}/${idDisciplina}`);

        return response;
    }

    async ativarDisciplina(idDisciplina) {
        const response = await fetch(`${this.#url}/activate/${idDisciplina}`, {
            method: 'PUT'
        });

        return response;
    }

    async desativarDisciplina(idDisciplina) {
        const response = await fetch(`${this.#url}/disable/${idDisciplina}`, {
            method: 'PUT'
        });

        return response;
    }

    async alterarDisciplina(idDisciplina, nome, descricao) {
        const response = await fetch(`${this.#url}/update/${idDisciplina}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, descricao })
        });

        return response;
    }
}

export default ApiDisciplina;
