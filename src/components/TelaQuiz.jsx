import { useEffect, useRef, useState } from "react";

const TEMPO_POR_PERGUNTA = 20;
const LETRAS = ["A", "B", "C", "D"];

export default function TelaQuiz({ rodada, onFim }) {
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState(undefined); // undefined = ainda não respondeu, null = tempo esgotado
  const [tempo, setTempo] = useState(TEMPO_POR_PERGUNTA);
  const [acertos, setAcertos] = useState(0);
  const [pontos, setPontos] = useState(0);
  const proximaRef = useRef(null);

  const p = rodada[indice];
  const respondida = escolha !== undefined;
  const ultima = indice === rodada.length - 1;

  // cronômetro: roda enquanto a pergunta não foi respondida
  useEffect(() => {
    if (respondida) return;
    if (tempo <= 0) {
      responder(null);
      return;
    }
    const id = setTimeout(() => setTempo((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [tempo, respondida]);

  function responder(i) {
    if (respondida) return;
    setEscolha(i);
    if (i === p.correta) {
      setAcertos((a) => a + 1);
      // 100 pontos base + bônus por rapidez
      setPontos((pts) => pts + 100 + tempo * 5);
    }
  }

  function proxima() {
    if (ultima) {
      onFim(acertos, pontos);
      return;
    }
    setIndice((n) => n + 1);
    setEscolha(undefined);
    setTempo(TEMPO_POR_PERGUNTA);
  }

  useEffect(() => {
    if (respondida) proximaRef.current?.focus();
  }, [respondida]);

  // atalhos de teclado: A-D / 1-4 para responder
  useEffect(() => {
    function aoTeclar(e) {
      const tecla = e.key.toUpperCase();
      let idx = LETRAS.indexOf(tecla);
      if (idx === -1) idx = ["1", "2", "3", "4"].indexOf(tecla);
      if (idx !== -1) responder(idx);
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  });

  function classeOpcao(i) {
    if (!respondida) return "opcao";
    if (i === p.correta) return "opcao certa";
    if (i === escolha) return "opcao errada";
    return "opcao apagada";
  }

  const acertou = escolha === p.correta;
  const tituloFeedback = escolha === null ? "Tempo esgotado!" : acertou ? "Mandou bem!" : "Quase!";

  return (
    <section className="tela">
      <div className="cartao">
        <div className="topo-quiz">
          <div className="logo-mini"><span>Mundo</span> Senai</div>
          <div className="contador">Pergunta {indice + 1} de {rodada.length}</div>
          <div className="pontos-ao-vivo">{pontos} pts</div>
        </div>

        <div className="progresso">
          <div className="progresso-barra" style={{ width: `${(indice / rodada.length) * 100}%` }} />
        </div>

        <div className="tempo">
          <span>{tempo}s</span>
          <div className="tempo-trilho">
            <div
              className={`tempo-barra${tempo <= 5 ? " alerta" : ""}`}
              style={{ width: `${(tempo / TEMPO_POR_PERGUNTA) * 100}%` }}
            />
          </div>
        </div>

        {/* key reinicia a animação de entrada a cada pergunta */}
        <div key={indice} className="tela">
          <span className="categoria">{p.categoria}</span>
          <h2 className="pergunta">{p.pergunta}</h2>

          <div className="opcoes">
            {p.opcoes.map((texto, i) => (
              <button key={i} className={classeOpcao(i)} disabled={respondida} onClick={() => responder(i)}>
                <span className="letra">{LETRAS[i]}</span>
                <span>{texto}</span>
              </button>
            ))}
          </div>

          {respondida && (
            <div className={`feedback ${acertou ? "ok" : "erro"}`}>
              <strong>{tituloFeedback}</strong> {p.explicacao}
            </div>
          )}
        </div>

        <div className="acoes">
          <button ref={proximaRef} className="botao" disabled={!respondida} onClick={proxima}>
            {ultima ? "Ver resultado" : "Próxima"}
          </button>
        </div>
      </div>
    </section>
  );
}
