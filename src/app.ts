import { DatabaseModel } from "./model/DatabaseModel.js";
import { server } from "./server.js";
import dotenv from "dotenv";

// Carrega as variáveis do .env para process.env.
// Deve ser chamado antes de qualquer leitura de process.env.
dotenv.config();

// Lê PORT e HOST do .env.
// parseInt converte PORT de string para número — o Express exige um número na porta.
// "??" garante fallback caso HOST não esteja definido no .env.
const port: number = 3333;
const host: string = process.env.HOST ?? "";

// Testa a conexão com o banco antes de subir o servidor.
// Evita que a API fique no ar sem banco — causaria erro em todas as rotas.
new DatabaseModel().testeConexao().then((ok) => {
    if (ok) {
        // Conexão bem-sucedida — inicia o servidor na porta e host definidos no .env.
        server.listen(port, () => {
            // console.info indica mensagem informativa (não é erro, não é debug).
            console.info(`Servidor executando no endereço ${host}:${port}`);
        });
    } else {
        // Falha na conexão — erro crítico, servidor NÃO é iniciado.
        console.error(`Não foi possível conectar com o banco de dados.`);
    }
});