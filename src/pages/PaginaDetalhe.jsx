import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MensagemErro from "../components/MensagemErro";
import {
  buscarChamado,
  iniciarChamado,
  resolverChamado,
  excluirChamado,
} from "../services/chamadoService";
import mensagemDoErro from "../services/mensagemDoErro";

function PaginaDetalhe() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");

  useEffect(function () {
    carregarChamado();
  }, [id]);

  async function carregarChamado() {
    setCarregando(true);
    try {
      const dados = await buscarChamado(id);
      setChamado(dados);
      setErro("");
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    } finally {
      setCarregando(false);
    }
  }

  async function aoIniciar(e) {
    e.preventDefault();
    try {
      await iniciarChamado(id, responsavel);
      setResponsavel("");
      carregarChamado();
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    }
  }

  async function aoResolver(e) {
    e.preventDefault();
    try {
      await resolverChamado(id, solucao);
      setSolucao("");
      carregarChamado();
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    }
  }

  async function aoExcluir() {
    try {
      await excluirChamado(id);
      navigate("/");
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
      setConfirmando(false);
    }
  }

  if (carregando) {
    return <div className="pagina"><p>Carregando chamado...</p></div>;
  }

  if (!chamado) {
    return (
      <div className="pagina">
        <Link to="/">← Voltar</Link>
        <MensagemErro mensagem={erro} />
      </div>
    );
  }

  return (
    <div className="pagina">
      <Link to="/">← Voltar</Link>
      <MensagemErro mensagem={erro} />

      <h2>{chamado.titulo}</h2>
      <div>
        <span className="selo">{chamado.status}</span>
        <span className="selo">{chamado.prioridade}</span>
      </div>

      <p><strong>Descrição:</strong> {chamado.descricao}</p>
      <p><strong>Tipo:</strong> {chamado.tipo}</p>
      <p><strong>Local:</strong> {chamado.local}</p>
      <p><strong>Aberto em:</strong> {chamado.data_abertura}</p>
      <p><strong>Responsável:</strong> {chamado.responsavel || "—"}</p>
      <p><strong>Solução:</strong> {chamado.solucao || "—"}</p>
      {chamado.data_resolucao && (
        <p><strong>Resolvido em:</strong> {chamado.data_resolucao}</p>
      )}

      <div className="acoes">
        {chamado.status !== "resolvido" && (
          <Link to={"/editar/" + chamado.id} className="botao-link">Editar</Link>
        )}
        <button onClick={function () { setConfirmando(true); }}>Excluir</button>
      </div>

      {confirmando && (
        <div className="confirmacao">
          <p>Tem certeza que deseja excluir este chamado?</p>
          <button onClick={aoExcluir}>Excluir</button>
          <button onClick={function () { setConfirmando(false); }}>Cancelar</button>
        </div>
      )}

      {chamado.status === "aberto" && (
        <form className="proxima-etapa" onSubmit={aoIniciar}>
          <h3>Próxima etapa</h3>
          <input
            type="text"
            placeholder="Responsável"
            value={responsavel}
            onChange={function (e) { setResponsavel(e.target.value); }}
            required
          />
          <button type="submit">Iniciar atendimento</button>
        </form>
      )}

      {chamado.status === "em andamento" && (
        <form className="proxima-etapa" onSubmit={aoResolver}>
          <h3>Próxima etapa</h3>
          <input
            type="text"
            placeholder="Solução"
            value={solucao}
            onChange={function (e) { setSolucao(e.target.value); }}
            required
          />
          <button type="submit">Resolver</button>
        </form>
      )}
    </div>
  );
}

export default PaginaDetalhe;