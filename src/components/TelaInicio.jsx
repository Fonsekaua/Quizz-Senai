import { useState } from "react";
import Logo from "./Logo.jsx";

export default function TelaInicio({
  onComecar,
  carregando,
  erro,
  onRetry
}) {
  return (
    <section className="tela">

      <Logo />
      <p className="descricao">
        Você acabou de conhecer o Mundo SENAI! Agora é a sua vez: responda ao quiz e mostre tudo
        o que aprendeu sobre as profissões e tecnologias do futuro.
      </p>
      {erro ? (
        <div className="perguntas-aviso" role="alert">
          <p>Não foi possível carregar as perguntas: {erro}</p>
          <button className="admin-text-button" onClick={onRetry}>Tentar novamente</button>
        </div>
      ) : (
        <button className="botao" onClick={onComecar} disabled={carregando}>
          {carregando ? "Carregando perguntas..." : "Começar o quiz"}
        </button>
      )}
    </section>
  );
}
