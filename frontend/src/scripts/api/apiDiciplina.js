class ApiDisciplina {
    #url = 'http://localhost:5050/disciplina';

    async pegarDisciplinas() {
        const response = await fetch(this.#url);
        return response;
    }

    async criarDisciplina(nome, descricao) {
        const response = await fetch(`${this.#url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome, descricao})
        });

        return response;
    }
}

export default ApiDisciplina;
