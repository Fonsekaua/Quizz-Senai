import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEdit,
  FaLayerGroup,
  FaPlus,
  FaQuestionCircle,
  FaTimes,
  FaTrash
} from "react-icons/fa";
import { salvarPerguntas } from "../data/perguntasApi.js";

const FORMULARIO_VAZIO = {
  categoria: "",
  pergunta: "",
  opcoes: ["", "", "", ""],
  correta: 0,
  explicacao: ""
};
const LETRAS = ["A", "B", "C", "D"];

export default function TelaGerenciarPerguntas({
  perguntas,
  setPerguntas,
  carregando,
  erro,
  onRetry,
  onVoltar
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [indiceEdicao, setIndiceEdicao] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!modalAberto) return undefined;
    function aoPressionarTecla(evento) {
      if (evento.key === "Escape" && !salvando) fecharModal();
    }
    window.addEventListener("keydown", aoPressionarTecla);
    return () => window.removeEventListener("keydown", aoPressionarTecla);
  }, [modalAberto, salvando]);

  function abrirModal(pergunta = null, indice = null) {
    setIndiceEdicao(indice);
    setFormulario(
      pergunta
        ? {
            ...pergunta,
            opcoes: [...pergunta.opcoes],
            correta: Number(pergunta.correta)
          }
        : { ...FORMULARIO_VAZIO, opcoes: [...FORMULARIO_VAZIO.opcoes] }
    );
    setErroAcao("");
    setMensagem("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setErroAcao("");
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarOpcao(indice, valor) {
    setFormulario((atual) => ({
      ...atual,
      opcoes: atual.opcoes.map((opcao, i) => (i === indice ? valor : opcao))
    }));
  }

  async function salvar(evento) {
    evento.preventDefault();
    const pergunta = {
      categoria: formulario.categoria.trim(),
      pergunta: formulario.pergunta.trim(),
      opcoes: formulario.opcoes.map((opcao) => opcao.trim()),
      correta: Number(formulario.correta),
      explicacao: formulario.explicacao.trim()
    };

    if (
      !pergunta.categoria ||
      !pergunta.pergunta ||
      pergunta.opcoes.length !== 4 ||
      pergunta.opcoes.some((opcao) => !opcao) ||
      !pergunta.explicacao
    ) {
      setErroAcao("Preencha todos os campos e as quatro alternativas.");
      return;
    }

    const atualizadas = [...perguntas];
    if (indiceEdicao === null) atualizadas.push(pergunta);
    else atualizadas[indiceEdicao] = pergunta;

    setSalvando(true);
    setErroAcao("");
    try {
      await salvarPerguntas(atualizadas);
      setPerguntas(atualizadas);
      setMensagem(
        indiceEdicao === null
          ? "Pergunta criada e salva."
          : "Pergunta atualizada e salva."
      );
      fecharModal();
    } catch (error) {
      setErroAcao(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(indice) {
    if (!window.confirm("Tem certeza de que deseja excluir esta pergunta?")) return;
    const atualizadas = perguntas.filter((_, i) => i !== indice);
    setErroAcao("");
    setMensagem("");
    try {
      await salvarPerguntas(atualizadas);
      setPerguntas(atualizadas);
      setMensagem("Pergunta excluída.");
    } catch (error) {
      setErroAcao(error.message);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-header">
          <div>
            <span className="admin-badge">MUNDO SENAI / ADMINISTRAÇÃO</span>
            <h1>Banco de <span>perguntas</span></h1>
            <p>Organize as perguntas e alternativas que aparecem no quiz.</p>
          </div>
          <button className="admin-back" onClick={onVoltar}>
            <FaArrowLeft aria-hidden="true" /> Voltar ao quiz
          </button>
        </header>

        <div className="admin-toolbar">
          <div className="admin-count">
            <FaLayerGroup aria-hidden="true" />
            <span><strong>{perguntas.length}</strong> {perguntas.length === 1 ? "pergunta" : "perguntas"}</span>
          </div>
          <button className="admin-primary" onClick={() => abrirModal()}>
            <FaPlus aria-hidden="true" /> Criar pergunta
          </button>
        </div>

        {erro && (
          <div className="admin-alert" role="alert">
            <p>Não foi possível carregar as perguntas: {erro}</p>
            <button className="admin-text-button" onClick={onRetry}>Tentar novamente</button>
          </div>
        )}
        {erroAcao && <p className="admin-alert" role="alert">{erroAcao}</p>}
        {mensagem && <p className="admin-success" role="status"><FaCheckCircle /> {mensagem}</p>}

        {carregando ? (
          <div className="admin-empty">Carregando perguntas...</div>
        ) : perguntas.length === 0 ? (
          <div className="admin-empty">
            <FaQuestionCircle aria-hidden="true" />
            <h2>Nenhuma pergunta por aqui</h2>
            <p>Crie a primeira pergunta para começar a montar seu quiz.</p>
            <button className="admin-primary" onClick={() => abrirModal()}>
              <FaPlus aria-hidden="true" /> Criar pergunta
            </button>
          </div>
        ) : (
          <div className="admin-grid">
            {perguntas.map((pergunta, indice) => (
              <article className="admin-question-card" key={`${indice}-${pergunta.pergunta}`}>
                <div className="admin-card-top">
                  <span className="admin-category">{pergunta.categoria}</span>
                  <span className="admin-card-number">#{String(indice + 1).padStart(2, "0")}</span>
                </div>
                <h2>{pergunta.pergunta}</h2>
                <ol className="admin-options">
                  {pergunta.opcoes.map((opcao, i) => (
                    <li className={i === pergunta.correta ? "admin-option correct" : "admin-option"} key={i}>
                      <span>{LETRAS[i]}</span>{opcao}
                    </li>
                  ))}
                </ol>
                <p className="admin-explanation">{pergunta.explicacao}</p>
                <div className="admin-card-actions">
                  <button onClick={() => abrirModal(pergunta, indice)} aria-label={`Editar pergunta ${indice + 1}`}>
                    <FaEdit aria-hidden="true" /> Editar
                  </button>
                  <button className="delete" onClick={() => excluir(indice)} aria-label={`Excluir pergunta ${indice + 1}`}>
                    <FaTrash aria-hidden="true" /> Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {modalAberto && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget && !salvando) fecharModal();
          }}
        >
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
            <header className="admin-modal-header">
              <div>
                <span className="admin-badge">BANCO DE PERGUNTAS</span>
                <h2 id="admin-modal-title">{indiceEdicao === null ? "Nova pergunta" : "Editar pergunta"}</h2>
                <p>Complete os campos e escolha a alternativa correta.</p>
              </div>
              <button className="admin-close" onClick={fecharModal} disabled={salvando} aria-label="Fechar">
                <FaTimes aria-hidden="true" />
              </button>
            </header>

            <form className="admin-form" onSubmit={salvar}>
              <label className="admin-field">
                <span>Categoria</span>
                <input autoFocus value={formulario.categoria} onChange={(e) => atualizarCampo("categoria", e.target.value)} placeholder="Ex.: Robótica" required />
              </label>
              <label className="admin-field">
                <span>Pergunta</span>
                <textarea rows="2" value={formulario.pergunta} onChange={(e) => atualizarCampo("pergunta", e.target.value)} placeholder="Escreva o enunciado da pergunta" required />
              </label>

              <fieldset className="admin-answer-group">
                <legend>Alternativas <small>Marque a resposta correta</small></legend>
                {formulario.opcoes.map((opcao, indice) => (
                  <div className="admin-answer-row" key={indice}>
                    <label className={`admin-answer-choice${Number(formulario.correta) === indice ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="correta"
                        value={indice}
                        checked={Number(formulario.correta) === indice}
                        onChange={() => atualizarCampo("correta", indice)}
                        aria-label={`Marcar alternativa ${LETRAS[indice]} como correta`}
                      />
                      <span>{LETRAS[indice]}</span>
                    </label>
                    <input
                      className="admin-answer-input"
                      value={opcao}
                      onChange={(e) => atualizarOpcao(indice, e.target.value)}
                      placeholder={`Alternativa ${LETRAS[indice]}`}
                      required
                    />
                  </div>
                ))}
              </fieldset>

              <label className="admin-field">
                <span>Explicação da resposta</span>
                <textarea rows="3" value={formulario.explicacao} onChange={(e) => atualizarCampo("explicacao", e.target.value)} placeholder="Explique por que essa alternativa está correta" required />
              </label>

              {erroAcao && <p className="admin-alert" role="alert">{erroAcao}</p>}
              <div className="admin-modal-actions">
                <button type="button" className="admin-secondary" onClick={fecharModal} disabled={salvando}>Cancelar</button>
                <button type="submit" className="admin-primary" disabled={salvando}>
                  <FaCheckCircle aria-hidden="true" /> {salvando ? "Salvando..." : "Salvar pergunta"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
