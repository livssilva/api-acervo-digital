import express from "express";
import cors from "cors";
import { router } from "./routes.js";

// Cria a instância do servidor Express.
const server = express();

// Habilita leitura de JSON no body das requisições.
// Sem isso, req.body chegaria como undefined nos controllers.
server.use(express.json());

// Habilita CORS — permite requisições de origens diferentes (ex: front-end em outra porta).
// Em produção, restringir para apenas os domínios autorizados.
server.use(cors());

// Registra todas as rotas da aplicação.
server.use(router);

export { server };