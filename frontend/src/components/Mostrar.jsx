/* eslint-disable react/prop-types */
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from "./CustomTable";

function Mostrar({ titulo, buttonVoltar, columns, data, buttons, handlePesquisar, divMensagem }) {
    return (
        <>
            {buttonVoltar}

            <div className="container">
                <h1 className="titulo">{titulo ? titulo : "Mostrar inativos/as"}</h1>
                <form className="form" autoComplete="off" onSubmit={(event) => {
                    event.preventDefault();
                }}>
                    <div className="form__containerElement form__containerElement--search">
                        <TextField
                            type="search"
                            onInput={handlePesquisar}
                            placeholder="Pesquisar"
                            variant="outlined"
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}

                        />
                    </div>

                    <CustomTable
                        columns={columns}
                        rows={data}
                        buttons={buttons}
                    />
                </form>

                {divMensagem}
            </div>
        </>
    );
}

export default Mostrar;
