/* eslint-disable react/prop-types */
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../utils/helpers";

function NotFould({ title }) {
    useDocumentTitle(title);

    return (
        <Container>
            <Link to="/" className="buttonVoltar button">Voltar para a página inicial</Link>

            <h1>404 Not Found</h1>
        </Container>
    );
}

export default NotFould;
