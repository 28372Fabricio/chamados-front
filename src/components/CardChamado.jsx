import { Link } from "react-router-dom";

function CardChamado(props) {
  const chamado = props.chamado;

  return (
    <Link to={"/chamado/" + chamado.id} className="card-chamado">
      <h3>{chamado.titulo}</h3>
      <p>{chamado.tipo} · {chamado.local}</p>
      <div>
        <span className="selo">{chamado.status}</span>
        <span className="selo">{chamado.prioridade}</span>
      </div>
    </Link>
  );
}

export default CardChamado;