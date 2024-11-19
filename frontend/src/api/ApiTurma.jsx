class ApiTurma {
    #url = 'http://localhost:5050/turma';

    async pegarTurmas() {
        const response = await fetch(this.#url);
        
        return response;
    }

    async pegarTurmasAtivas() {
        const response = await fetch(`${this.#url}/actives`);

        return response;
    }

    async pegarTurmasInativas() {
        const response = await fetch(`${this.#url}/inactives`);

        return response;
    }

    async pegarTurmasFiltradas(filtro, mostrar) {
        const response = await fetch(`${this.#url}/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ filtro, mostrar })
        });

        return response;
    }

    async criarTurma(nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala) {
        const response = await fetch(`${this.#url}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala })
        });

        return response;
    }

    async pegarTurma(idTurma) {
        const response = await fetch(`${this.#url}/${idTurma}`);

        return response;
    }

    async ativarTurma(idTurma) {
        const response = await fetch(`${this.#url}/activate/${idTurma}`, {
            method: 'PUT'
        });

        return response;
    }

    async desativarTurma(idTurma) {
        const response = await fetch(`${this.#url}/disable/${idTurma}`, {
            method: 'PUT'
        });

        return response;
    }

    async alterarTurma(idTurma, nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala) {
        const response = await fetch(`${this.#url}/update/${idTurma}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, diaSemana, horarioInicio, horarioTermino, idDisciplina, idProfessor, idSala })
        });

        return response;
    }

    async mostrarTurmasSemOAluno(idAluno, filtro) {
        if(filtro) {
            const response = await fetch(`${this.#url}/withoutAluno/${idAluno}?filtro=${filtro}`);

            return response;
        }

        const response = await fetch(`${this.#url}/withoutAluno/${idAluno}`);

        return response;
    }

    async mostrarTurmasDoAluno(idAluno, filtro) {
        if(filtro) {
            const response = await fetch(`${this.#url}/withAluno/${idAluno}?filtro=${filtro}`);

            return response;
        }

        const response = await fetch(`${this.#url}/withAluno/${idAluno}`);

        return response;
    }
}

export default ApiTurma;
