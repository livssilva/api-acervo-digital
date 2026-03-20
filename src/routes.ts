import { Router, type Request, type Response } from "express";
import AlunoController from "./controller/AlunoController.js";
import LivroController from "./controller/LivroController.js";
import EmprestimoController from "./controller/EmprestimoController.js";

const router = Router();

// Health check — verifica se a API está no ar e retorna o timestamp atual.
router.get("/", (req: Request, res: Response) => {
    return res.status(200).json(`Aplicação online. Timestamp: ${new Date()}`);
});

// ==================== ALUNO ====================

// Lista todos os alunos ativos
router.get("/api/alunos", AlunoController.todos);

// Busca um aluno pelo ID — ex: GET /api/alunos/3
router.get("/api/alunos/:id", AlunoController.aluno);

// Cadastra um novo aluno — dados chegam no body
router.post("/api/alunos", AlunoController.cadastrar);

// Remove logicamente um aluno pelo ID
router.delete("/api/alunos/:id", AlunoController.remover);

// Atualiza os dados de um aluno pelo ID — novos dados chegam no body
router.put("/api/alunos/:id", AlunoController.atualizar);