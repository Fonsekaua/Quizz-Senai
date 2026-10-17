import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const arquivoPerguntas = fileURLToPath(new URL("./src/data/data.json", import.meta.url));

function perguntasApi() {
  return {
    name: "perguntas-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/api/perguntas") return next();

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        if (req.method === "GET") {
          try {
            const conteudo = await readFile(arquivoPerguntas, "utf8");
            res.statusCode = 200;
            res.end(conteudo);
          } catch (error) {
            server.config.logger.error(`Falha ao ler src/data/data.json: ${error.message}`);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Não foi possível ler src/data/data.json." }));
          }
          return;
        }

        if (req.method !== "PUT") {
          res.statusCode = 405;
          res.setHeader("Allow", "GET, PUT");
          res.end(JSON.stringify({ error: "Método não permitido." }));
          return;
        }

        try {
          let corpo = "";
          for await (const trecho of req) {
            corpo += trecho;
            if (corpo.length > 1_000_000) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: "O arquivo de perguntas excede o limite permitido." }));
              return;
            }
          }

          let perguntas;
          try {
            perguntas = JSON.parse(corpo);
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "O conteúdo enviado não é um JSON válido." }));
            return;
          }

          const valido =
            Array.isArray(perguntas) &&
            perguntas.every((pergunta) =>
              pergunta &&
              typeof pergunta.categoria === "string" && pergunta.categoria.trim() &&
              typeof pergunta.pergunta === "string" && pergunta.pergunta.trim() &&
              Array.isArray(pergunta.opcoes) && pergunta.opcoes.length === 4 &&
              pergunta.opcoes.every((opcao) => typeof opcao === "string" && opcao.trim()) &&
              Number.isInteger(pergunta.correta) &&
              pergunta.correta >= 0 && pergunta.correta < 4 &&
              typeof pergunta.explicacao === "string" && pergunta.explicacao.trim()
            );

          if (!valido) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              error: "Cada pergunta deve ter categoria, enunciado, quatro alternativas, resposta correta válida e explicação."
            }));
            return;
          }

          await writeFile(arquivoPerguntas, `${JSON.stringify(perguntas, null, 2)}\n`, "utf8");
          res.statusCode = 200;
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          server.config.logger.error(`Falha ao salvar src/data/data.json: ${error.message}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Não foi possível salvar src/data/data.json." }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), perguntasApi()],
  // caminhos relativos: o build funciona aberto em qualquer pasta/servidor
  base: "./"
});
