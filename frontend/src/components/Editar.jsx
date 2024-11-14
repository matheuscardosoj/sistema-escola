/* eslint-disable react/prop-types */
function Editar({ titulo, buttonVoltar, inputs, handleEnviarClick, divMensagem }) {
  return (
    <>
        {buttonVoltar}

        <div className="container">
            <h1 className="titulo">{titulo ? titulo : "Inserir"}</h1>

            <form className="form" autoComplete="off" onSubmit={(event) => event.preventDefault()}>
                <div className="form__container form__container--column">
                    {inputs.map((input) => input)}
                </div>

                <div className="buttons buttons--right">
                    <button className="button" id="buttonEnviar" onClick={handleEnviarClick}>
                        Enviar
                    </button>
                </div>
            </form>

            {divMensagem}
        </div>
    </>
  );
}

export default Editar;
