/* eslint-disable react/prop-types */
function Editar({ titulo, buttonVoltar, buttonEditar, inputs, divMensagem }) {
  return (
    <>
        {buttonVoltar}

        <div className="container">
            <h1 className="titulo">{titulo ? titulo : "Editar"}</h1>

            <form className="form" autoComplete="off" onSubmit={(event) => event.preventDefault()}>
                <div className="form__container form__container--column">
                    {inputs.map((input) => input)}
                </div>

                <div className="buttons buttons--right">
                    {buttonEditar}
                </div>
            </form>

            {divMensagem}
        </div>
    </>
  );
}

export default Editar;
