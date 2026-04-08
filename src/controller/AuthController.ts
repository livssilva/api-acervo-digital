import type { Request, Response } from "express";
import Aluno from "../model/Aluno.js";

class AuthController {

    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, senha } = req.body;

            // Verifica se os campos foram enviados
            if (!email || !senha) {
                return res.status(400).json({
                    message: "Email e senha são obrigatórios."
                });
            }

            // Validação do domínio obrigatório
            if (!email.endsWith("@adigital.com.br")) {
                return res.status(400).json({
                    message: "O email deve ser do domínio @adigital.com.br"
                });
            }

            // Busca aluno pelo email (precisa existir no Model Aluno)
            const aluno = await Aluno.buscarAlunoPorEmail(email);

            // Verifica se existe aluno
            if (!aluno) {
                return res.status(404).json({
                    message: "Aluno não encontrado."
                });
            }

            // Verifica senha
            if (aluno.senha !== senha) {
                return res.status(401).json({
                    message: "Senha inválida."
                });
            }

            // Login OK
            return res.status(200).json({
                message: "Login realizado com sucesso!",
                aluno: {
                    id_aluno: aluno.id_aluno,
                    nome: aluno.nome,
                    sobrenome: aluno.sobrenome,
                    email: aluno.email
                }
            });

        } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
        message: "Erro interno no servidor."
    });
}
    }
}

export default AuthController;