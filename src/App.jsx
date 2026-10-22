import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Cabecalho from "./components/Cabecalho";
import MensagemErro from "./components/MensagemErro";
import PaginaLista from "./pages/PaginaLista";
import PaginaDetalhe from "./pages/PaginaDetalhe";
import PaginaFormulario from "./pages/PaginaFormulario";
import { buscarEu } from "./services/chamadoService";
import mensagemDoErro from "./services/mensagemDoErro";

function App() {
  const [nomeDono, setNomeDono] = useState("");
  const [erro, setErro] = useState("");

  useEffect(function () {
    carregarDono();
  }, []);

  async function carregarDono() {
    try {
      const dados = await buscarEu();
      setNomeDono(dados.nome);
    } catch (erroApi) {
      setErro(mensagemDoErro(erroApi));
    }
  }

  return (
    <div className="App">
      <Cabecalho nome={nomeDono} />
      <MensagemErro mensagem={erro} />
      <Routes>
        <Route path="/" element={<PaginaLista />} />
        <Route path="/chamado/:id" element={<PaginaDetalhe />} />
        <Route path="/novo" element={<PaginaFormulario />} />
        <Route path="/editar/:id" element={<PaginaFormulario />} />
      </Routes>
    </div>
  );
}

export default App;