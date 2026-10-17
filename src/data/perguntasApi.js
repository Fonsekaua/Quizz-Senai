async function requisitarPerguntas(opcoes = {}) {
  const resposta = await fetch("/api/perguntas", opcoes);
  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.error || "Não foi possível acessar as perguntas.");
  }

  return resultado;
}

export function buscarPerguntas() {
  return requisitarPerguntas();
}

export function salvarPerguntas(perguntas) {
  return requisitarPerguntas({
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(perguntas)
  });
}
