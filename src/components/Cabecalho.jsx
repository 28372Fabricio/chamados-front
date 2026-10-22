import { Link } from "react-router-dom";

function Cabecalho(props) {
  return (
    <header className="cabecalho">
      <Link to="/" className="nome-sistema">Chamados IFRN</Link>
      <span>Olá, {props.nome}</span>
    </header>
  );
}

export default Cabecalho;