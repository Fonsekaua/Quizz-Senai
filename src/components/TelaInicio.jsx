import { useState } from "react";
import Logo from "./Logo.jsx";

export default function TelaInicio({ onComecar }) {
  return (
    <section className="tela">

      <Logo />
      <p className="descricao">
        Você acabou de conhecer o Mundo SENAI! Agora é a sua vez: responda ao quiz e mostre tudo
        o que aprendeu sobre as profissões e tecnologias do futuro.
      </p>
      <button className="botao" onClick={onComecar}>Começar o quiz</button>
    </section>
  );
}
