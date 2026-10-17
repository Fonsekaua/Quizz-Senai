import Logo from "./Logo.jsx";

function avaliar(pct) {
  if (pct >= 90) {
    return {
      titulo: "Profissional do futuro!",
      msg: "Você domina as tecnologias que estão transformando a indústria. Sua história começa aqui!"
    };
  }
  if (pct >= 60) {
    return {
      titulo: "Muito bem!",
      msg: "Você está no caminho certo. Que tal explorar os workshops e desafios do Mundo SENAI para ir ainda mais longe?"
    };
  }
  if (pct >= 30) {
    return {
      titulo: "Bom começo!",
      msg: "Tem muita coisa incrível para descobrir. Participe das atividades práticas e conheça novos caminhos!"
    };
  }
  return {
    titulo: "Hora de explorar!",
    msg: "Todo profissional começou do zero. O Mundo SENAI é o lugar perfeito para dar o primeiro passo."
  };
}

export default function TelaResultado({ acertos, total, pontos, onReiniciar }) {
  const pct = Math.round((acertos / total) * 100);
  const { titulo, msg } = avaliar(pct);

  return (
    <section className="tela">
      <div className="resultado">
        <Logo />
        <div className="placar" style={{ "--pct": pct }}>
          <div className="placar-numero">
            {acertos}<small>/{total}</small>
          </div>
        </div>
        <h2 className="titulo-resultado">{titulo}</h2>
        <p className="mensagem-resultado">{msg} Pontuação: {pontos} pts.</p>
        <div className="botoes-resultado">
          <button className="botao" onClick={onReiniciar}>Jogar de novo</button>
        </div>
      </div>
    </section>
  );
}
