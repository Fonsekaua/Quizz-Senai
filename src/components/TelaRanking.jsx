import {
  FaTrophy,
  FaMedal,
  FaArrowLeft,
  FaCrown,
  FaStar,
} from "react-icons/fa";




export default function TelaRanking({participantes, onBack, participanteAtual }) {
  // Ordena os participantes da maior para a menor pontuação.
  const ranking = [...participantes].sort(
    (a, b) => b.pontos - a.pontos
  );

  const primeiro = ranking[0];
  const segundo = ranking[1];
  const terceiro = ranking[2];

  const topTres = [segundo, primeiro, terceiro];

  const icones = {
    1: <FaCrown />,
    2: <FaMedal />,
    3: <FaMedal />,
  };

  function formatarPontos(pontos) {
    return `${pontos} pts`;
  }

  return (
    <main className="ranking-page">
      <section className="ranking-card">
        <header className="ranking-header">
          <span className="ranking-badge">MUNDO SENAI</span>

          <div className="ranking-title-icon">
            <FaTrophy />
          </div>

          <h1>
            RANKING
            <span> DOS PARTICIPANTES.</span>
          </h1>

          <p>
            Quem está dominando o desafio?
            <br />
            Confira os resultados e descubra sua posição!
          </p>
        </header>

        <section className="ranking-content">
          <div className="ranking-section-title">
            <div>
              <h2>Os melhores do desafio</h2>
              <p>Os três participantes com mais pontos.</p>
            </div>

            <FaStar className="ranking-star" />
          </div>

          <div className="ranking-podium">
            {topTres.map((participante) => {
              const posicao = ranking.findIndex(
                (item) => item.id === participante.id
              ) + 1;

              return (
                <article
                  key={participante.id}
                  className={`podium-item podium-position-${posicao}`}
                >
                  <div className="podium-medal">
                    {icones[posicao]}
                  </div>

                  <div className="podium-avatar">
                    {participante.nome
                      .split(" ")
                      .map((parte) => parte[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <h3>{participante.nome}</h3>

                  <span className="podium-points">
                    {formatarPontos(participante.pontos)}
                  </span>

                  <div className="podium-base">
                    <span>{posicao}º</span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="ranking-list-header">
            <div>
              <h2>Classificação geral</h2>
              <p>Todos os participantes do quiz.</p>
            </div>

            <span className="ranking-total">
              {ranking.length} participantes
            </span>
          </div>

          <div className="ranking-table">
            {ranking.map((participante, index) => {
              const posicao = index + 1;

              const isCurrentParticipant =
                participanteAtual &&
                participanteAtual.nome?.trim().toLowerCase() ===
                  participante.nome.trim().toLowerCase();

              return (
                <article
                  key={participante.id}
                  className={`ranking-row ${
                    isCurrentParticipant ? "ranking-row-current" : ""
                  }`}
                >
                  <div className="ranking-position">
                    {posicao <= 3 ? (
                      <span className={`position-medal position-${posicao}`}>
                        {icones[posicao]}
                      </span>
                    ) : (
                      <span className="position-number">
                        {String(posicao).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="ranking-avatar">
                    {participante.nome
                      .split(" ")
                      .map((parte) => parte[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="ranking-participant">
                    <h3>
                      {participante.nome}

                      {isCurrentParticipant && (
                        <span className="ranking-you">VOCÊ</span>
                      )}
                    </h3>

                    <p>{participante.turma}</p>
                  </div>

                  <div className="ranking-score">
                    <strong>
                      {formatarPontos(participante.pontos)}
                    </strong>
                    <span>PONTUAÇÃO</span>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="ranking-back-button"
            onClick={onBack}
          >
            <FaArrowLeft />
            <span>VOLTAR AO QUIZ</span>
          </button>
        </section>

        <footer className="ranking-footer">
          <span>MUNDO SENAI</span>
          <span className="ranking-footer-separator">/</span>
          <span>TECNOLOGIA E INOVAÇÃO</span>
        </footer>
      </section>
    </main>
  );
}