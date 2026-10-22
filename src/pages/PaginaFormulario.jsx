import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MensagemErro from "../components/MensagemErro";
import {
  buscarChamado,
  criarChamado,
  editarChamado,
  listarTipos,
  listarLocais,
  listarPrioridades,
} from "../services/chamadoService";
import mensagemDoErro from "../services/mensagemDoErro";

function PaginaFormulario() {
  const params = useParams();
  const id = params.id;
  const editando = id !== undefined;
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [bloqueado, setBloqueado] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(function () {
    carregarTela();
  }, [id]);

  async function carregarTela() {
    try {
      setTipos(await listarTipos());
      setLocais(await listarLocais());
      setPrioridades(await listarPrioridades());

      if (editando) {
        const chamado = await buscarChamado(id);
        if (chamado.status === "resolvido") {
          setBloqueado(true);
        } else {
          setTitulo(chamado.titulo);
          setDescricao(chamado.descricao);
          setTipo(chamado.tipo);
          setLocal(chamado.local);
          setPrioridade(chamado.prioridade);
          setDataAbertura(chamado.data_abertura);
        }
      }
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    } finally {
      setCarregando(false);
    }
  }

  async function aoEnviar(e) {
    e.preventDefault();
    const dados = {
      titulo: titulo,
      descricao: descricao,
      tipo: tipo,
      local: local,
      prioridade: prioridade,
      data_abertura: dataAbertura,
    };

    try {
      if (editando) {
        await editarChamado(id, dados);
        setSucesso("Chamado atualizado com sucesso!");
      } else {
        await criarChamado(dados);
        setSucesso("Chamado aberto com sucesso!");
        setTitulo("");
        setDescricao("");
        setTipo("");
        setLocal("");
        setPrioridade("");
        setDataAbertura("");
      }
      setErro("");
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
      setSucesso("");
    }
  }

  if (carregando) {
    return <div className="pagina"><p>Carregando...</p></div>;
  }

  if (bloqueado) {
    return (
      <div className="pagina">
        <p>Chamados resolvidos não podem ser editados.</p>
        <Link to={"/chamado/" + id}>← Voltar</Link>
      </div>
    );
  }

  return (
    <div className="pagina">
      <h2>{editando ? "Editar chamado" : "Abrir chamado"}</h2>

      <form className="formulario" onSubmit={aoEnviar}>
        <label>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={function (e) { setTitulo(e.target.value); }}
          required
        />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={function (e) { setDescricao(e.target.value); }}
          required
        />

        <label>Tipo</label>
        <select value={tipo} onChange={function (e) { setTipo(e.target.value); }} required>
          <option value="">Selecione...</option>
          {tipos.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <label>Local</label>
        <select value={local} onChange={function (e) { setLocal(e.target.value); }} required>
          <option value="">Selecione...</option>
          {locais.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <label>Prioridade</label>
        <select value={prioridade} onChange={function (e) { setPrioridade(e.target.value); }} required>
          <option value="">Selecione...</option>
          {prioridades.map(function (item) {
            return <option key={item} value={item}>{item}</option>;
          })}
        </select>

        <label>Data de abertura</label>
        <input
          type="date"
          value={dataAbertura}
          onChange={function (e) { setDataAbertura(e.target.value); }}
          required
        />

        <MensagemErro mensagem={erro} />
        {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

        <div className="acoes">
          <button type="submit">Salvar</button>
          <button type="button" onClick={function () { navigate("/"); }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default PaginaFormulario;