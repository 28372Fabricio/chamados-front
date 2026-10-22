function mensagemDoErro(erroApi) {
  if (erroApi.response) {
    const detalhe = erroApi.response.data.detail;
    if (typeof detalhe === "string") {
      return detalhe;
    }
    if (Array.isArray(detalhe)) {
      return detalhe.map(function (item) { return item.msg; }).join(", ");
    }
    if (erroApi.response.status === 401) {
      return "Chave inválida. Verifique o arquivo .env.";
    }
    return "Erro " + erroApi.response.status + " na API.";
  }
  return "Não foi possível conectar à API.";
}

export default mensagemDoErro;