import { useEffect, useState } from "react";
import FundoVideo from "./components/FundoVideo.jsx";
import TelaInicio from "./components/TelaInicio.jsx";
import TelaQuiz from "./components/TelaQuiz.jsx";
import TelaResultado from "./components/TelaResultado.jsx";
import TelaFormulario from "./components/TelaFormulario.jsx";
import TelaRanking from "./components/TelaRanking.jsx";
import TelaGerenciarPerguntas from "./components/TelaGerenciarPerguntas.jsx";
import { buscarPerguntas } from "./data/perguntasApi.js";

export const TOTAL = 5;

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// embaralha perguntas e a ordem das alternativas de cada uma
function montarRodada(perguntas) {
  return embaralhar(perguntas).slice(0, TOTAL).map((p) => {
    const ordem = embaralhar([0, 1, 2, 3]);
    return {
      ...p,
      opcoes: ordem.map((i) => p.opcoes[i]),
      correta: ordem.indexOf(p.correta)
    };
  });
}

export default function App() {
  const [rotaAdmin, setRotaAdmin] = useState(
    () => window.location.pathname === "/auth/perguntas"
  );
  const [perguntas, setPerguntas] = useState([]);
  const [carregandoPerguntas, setCarregandoPerguntas] = useState(true);
  const [erroPerguntas, setErroPerguntas] = useState("");
  const [tela, setTela] = useState("inicio");
  const [telaAnterior,setTelaAnterior] = useState('')
  const [rodada, setRodada] = useState([]);
  const [resultado, setResultado] = useState({ acertos: 0, pontos: 0 });
  const [ranking,setRanking] = useState(() => {
    const data = JSON.parse(
    localStorage.getItem("ranking") || "[]"
  );

  return data;
  })
  const [participante,setParticipante] = useState({
    nome: "",
    turma:""
  })
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tela]);

  useEffect(() => {
    function atualizarRota() {
      setRotaAdmin(window.location.pathname === "/auth/perguntas");
    }
    window.addEventListener("popstate", atualizarRota);
    return () => window.removeEventListener("popstate", atualizarRota);
  }, []);

  async function carregarPerguntas() {
    setCarregandoPerguntas(true);
    setErroPerguntas("");
    try {
      setPerguntas(await buscarPerguntas());
    } catch (error) {
      setErroPerguntas(error.message);
    } finally {
      setCarregandoPerguntas(false);
    }
  }

  useEffect(() => {
    carregarPerguntas();
  }, []);

  function navegar(caminho) {
    window.history.pushState({}, "", caminho);
    setRotaAdmin(caminho === "/auth/perguntas");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function iniciar(dados) {
    setRodada(montarRodada(perguntas));
    setTela("quiz");
    setParticipante(dados)
  }
  function verRanking(){
    setTelaAnterior(tela);
    setTela('ranking')
  }
  function voltarTela(){
    setTela(telaAnterior)
  }
  function cadastrar(){
      if(perguntas.length == 0) {
      navegar('/auth/perguntas')
      return;
    }
    setParticipante({
      nome:"",
      turma:""
    })
    setTela('formulario')
  }
function finalizar(acertos, pontos) {
  setResultado({ acertos, pontos });
  setTela("resultado");

  const novoParticipante = {
    id: ranking.length + 1,
    nome: participante.nome,
    turma: participante.turma || "Visitante",
    pontos,
  };

  setRanking((prev) => {
    const novoRanking = [...prev, novoParticipante];

    localStorage.setItem(
      "ranking",
      JSON.stringify(novoRanking)
    );

    return novoRanking;
  });
}
useEffect(() => {
  if (tela !== "resultado") return;

  const timer = setTimeout(() => {
    setTela("inicio");
  }, 15000);

  return () => {
    clearTimeout(timer);
  };
}, [tela]);
  return (
    <>
      <FundoVideo escuro={rotaAdmin || tela !== "inicio"} />
      {rotaAdmin ? (
        <TelaGerenciarPerguntas
          perguntas={perguntas}
          setPerguntas={setPerguntas}
          carregando={carregandoPerguntas}
          erro={erroPerguntas}
          onRetry={carregarPerguntas}
          onVoltar={() => navegar("/")}
        />
      ) : (
      <main>
        {
          ranking.length >= 3 && tela != "ranking" &&
             <button className="showRanking" onClick={verRanking}>
          Ver Ranking
        </button>
        }
        {tela === "inicio" && (
          <TelaInicio
            onComecar={cadastrar}
            carregando={carregandoPerguntas}
            erro={erroPerguntas}
            onRetry={carregarPerguntas}
          />
        )}
        {tela == "formulario" && <TelaFormulario onStart={iniciar} /> }
        {tela === "quiz" && <TelaQuiz rodada={rodada} onFim={finalizar} />}
        {
          tela == "ranking" && 
          <TelaRanking 
          participantes={ranking}
          onBack={voltarTela}
           participanteAtual={{
            id: ranking.length,
            nome: participante.nome,
            turma:participante.turma
           }}
          />
        }
        {tela === "resultado" && (
          <TelaResultado
            acertos={resultado.acertos}
            total={rodada.length}
            pontos={resultado.pontos}
            onReiniciar={cadastrar}
          />
        )}
      </main>
      )}
    </>
  );
}
