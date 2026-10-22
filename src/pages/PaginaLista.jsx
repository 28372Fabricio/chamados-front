import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CardChamado from "../components/CardChamado";
import MensagemErro from "../components/MensagemErro";
import {
  listarChamados,
  listarTipos,
  listarLocais,
  listarPrioridades,
} from "../services/chamadoService";
import mensagemDoErro from "../services/mensagemDoErro";

function PaginaLista() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  useEffect(function () {
    carregarOpcoes();
  }, []);

  useEffect(function () {
    carregarChamados();
  }, [busca, status, tipo, local, prioridade]);

  async function carregarOpcoes() {
    try {
      setTipos(await listarTipos());
      setLocais(await listarLocais());
      setPrioridades(await listarPrioridades());
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    }
  }

  async function carregarChamados() {
    setCarregando(true);
    try {
      const dados = await listarChamados({
        busca: busca,
        status: status,
        tipo: tipo,
        local: local,
        prioridade: prioridade,
      });
      setChamados(dados);
      setErro("");
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina">
      <div className="topo-lista">
        <h2>Chamados</h2>
        <Link to="/novo" className="botao-link">+ Abrir chamado</Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por título ou descrição..."
        value={busca}
        onChange={function (e) { setBusca(e.target.value); }}
      />

      <div className="filtros">
        <select value={status} onChange={function (e) { setStatus(e.target.value); }}>
          <option value="">Status</option>
          <option value="aberto">aberto</option>
          <option value="em andamento">em andamento</option>
          <option value="resolvido">resolvido</option>
        </select>

        <select value={tipo} onChange={function (e) { setTipo(e.target.value); }}>
          <option value="">Tipo</option>
          {tipos.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <select value={local} onChange={function (e) { setLocal(e.target.value); }}>
          <option value="">Local</option>
          {locais.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <select value={prioridade} onChange={function (e) { setPrioridade(e.target.value); }}>
          <option value="">Prioridade</option>
          {prioridades.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>
      </div>

      <MensagemErro mensagem={erro} />

      {carregando && <p>Carregando chamados...</p>}

      {!carregando && !erro && chamados.length === 0 && (
        <p>Nenhum chamado encontrado.</p>
      )}

      <div className="lista-chamados">
        {chamados.map(function (chamado) {
          return <CardChamado key={chamado.id} chamado={chamado} />;
        })}
      </div>
    </div>
  );
}

export default PaginaLista;