import { useState } from "react";
import {
  FaUser,
  FaGraduationCap,
  FaArrowRight,
  FaRocket,
} from "react-icons/fa";


export default function TelaFormulario({ onStart }) {

  const [participante, setParticipante] = useState({
    nome: "",
    turma: "",
  });

  function handleChange(e) {
    setParticipante({
      ...participante,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const dados = {
      nome: participante.nome.trim(),
      turma: participante.turma.trim(),
    };

    if (!dados.nome) return;
    if (onStart) {
      onStart(dados);
    } else {
      console.log("Participante:", dados);
    }
  }

  return (
    <main className="quiz-page">
      <section className="quiz-card">
        <div className="quiz-card-content">
          <header className="quiz-header">
            <span className="quiz-badge">MUNDO SENAI</span>

            <div className="quiz-icon" aria-hidden="true">
              <FaRocket />
            </div>

            <h1>
              PREPARE-SE
              <span>PARA O DESAFIO.</span>
            </h1>

            <p>
              Você explorou o Mundo SENAI. Agora é hora de testar seus
              conhecimentos sobre as profissões e tecnologias do futuro!
            </p>
          </header>

          <form className="quiz-form" onSubmit={handleSubmit}>
            <div className="quiz-form-title">
              <h2>Quem está participando?</h2>
              <p>Identifique-se para começar o desafio.</p>
            </div>

            <div className="quiz-field">
              <label htmlFor="nome">Nome do participante</label>

              <div className="quiz-input-wrapper">
                <FaUser className="quiz-input-icon" aria-hidden="true" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Digite seu nome completo"
                  value={participante.nome}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="quiz-field">
              <label htmlFor="turma">
                Turma <span className="optional-label">(opcional)</span>
              </label>

              <div className="quiz-input-wrapper">
                <FaGraduationCap
                  className="quiz-input-icon"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  id="turma"
                  name="turma"
                  placeholder="Ex.: Desenvolvimento Web"
                  value={participante.turma}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>
            </div>

            <button type="submit" className="quiz-button">
              <span>COMEÇAR O QUIZ</span>
              <FaArrowRight className="quiz-button-icon" aria-hidden="true" />
            </button>

            <div className="quiz-notice">
              <span className="quiz-notice-dot" aria-hidden="true" />
              <p>Prepare-se para testar seus conhecimentos!</p>
            </div>
          </form>
        </div>

        <footer className="quiz-footer">
          <span>MUNDO SENAI</span>
          <span className="quiz-footer-separator">/</span>
          <span>TECNOLOGIA E INOVAÇÃO</span>
        </footer>
      </section>
    </main>
  );
}
