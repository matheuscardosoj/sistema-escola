/* eslint-disable react/prop-types */
import { InputAdornment, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from './CustomTable';

function Gerenciar({ titulo, columns, data, handleEditClick, handleDisableClick, handleInsertClick, handleShowInactiveClick, handlePesquisar, divMensagem }) {
    return (
        <>
            <Link className="buttonVoltar button" to="/">
                Voltar
            </Link>

            <div className="container">
                <h1 className="titulo">{ titulo ? titulo : "Gerenciar" }</h1>
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
                        buttons={[
                            {
                                label: "Editar",
                                onClick: handleEditClick,
                            },
                            {
                                label: "Desativar",
                                onClick: handleDisableClick,
                            },
                        ]}
                    />

                    <div className="buttons buttons--right">
                        <button className="button" onClick={() => {
                            handleInsertClick();
                        }}>Inserir</button>
                        <button className="button" onClick={() => {
                            handleShowInactiveClick();
                        }}>Mostrar inativos</button>
                    </div>
                </form>

                {divMensagem}
            </div>
        </>
    );
}

export default Gerenciar;