function MensagemErro(props) {
  if (!props.mensagem) {
    return null;
  }
  return (
    <div className="mensagem-erro">
      <p>{props.mensagem}</p>
    </div>
  );
}

export default MensagemErro;