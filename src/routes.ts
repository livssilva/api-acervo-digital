import { Router, type Request, type Response } from "express";
import AlunoController from "./controller/AlunoController.js";
import LivroController from "./controller/LivroController.js";
import EmprestimoController from "./controller/EmprestimoController.js";
import AuthController from "./controller/AuthController.js";

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

router.post("/login", AuthController.login);

// ==================== LIVRO ====================

// Lista todos os livros ativos
router.get("/api/livros", LivroController.todos);

// Busca um livro pelo ID — ex: GET /api/livros/5
router.get("/api/livros/:id", LivroController.livro);

// Cadastra um novo livro — dados chegam no body
router.post("/api/livros", LivroController.cadastrar);

// Remove logicamente um livro e seus empréstimos vinculados pelo ID
router.delete("/api/livros/:id", LivroController.remover);

// Atualiza os dados de um livro pelo ID — novos dados chegam no body
router.put("/api/livros/:id", LivroController.atualizar);

// ==================== EMPRÉSTIMO ====================

// Lista todos os empréstimos ativos (com dados de aluno e livro via JOIN)
router.get("/api/emprestimos", EmprestimoController.todos);

// Busca um empréstimo pelo ID — ex: GET /api/emprestimos/2
router.get("/api/emprestimos/:id", EmprestimoController.emprestimo);

// Cadastra um novo empréstimo — IDs de aluno e livro chegam no body
router.post("/api/emprestimos", EmprestimoController.cadastrar);

// Remove logicamente um empréstimo pelo ID
router.delete("/api/emprestimos/:id", EmprestimoController.remover);

// Atualiza os dados de um empréstimo pelo ID — novos dados chegam no body
router.put("/api/emprestimos/:id", EmprestimoController.atualizar);

export { router };