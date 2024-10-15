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

    async pegarDisciplina(idDisciplina) {
        const response = await fetch(`${this.#url}/${idDisciplina}`);

        return response;
    }
}

export default ApiDisciplina;
