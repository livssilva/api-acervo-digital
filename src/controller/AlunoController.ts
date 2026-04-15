import Aluno from "../model/Aluno.js";
import { type Request, type Response } from "express";
import type AlunoDTO from "../dto/AlunoDTO.js";

class AlunoController extends Aluno {

    /**
     * Retorna todos os alunos ativos
     */
    static async todos(req: Request, res: Response) {
        try {
            const listaDeAlunos = await Aluno.listarAlunos();

            if (listaDeAlunos === null) {
                return res.status(500).json({ mensagem: "Erro ao recuperar os alunos." });
            }

            return res.status(200).json(listaDeAlunos);

        } catch (error) {
            console.error(`Erro ao listar alunos: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações do aluno.", error: String(error) });
        }
    }

    /**
     * Retorna um aluno pelo ID
     */
    static async aluno(req: Request, res: Response) {
        try {
            const idAluno = parseInt(req.params.id as string);
            const aluno = await Aluno.listarAluno(idAluno);

            return res.status(200).json(aluno);

        } catch (error) {
            console.error(`Erro ao listar aluno: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações do aluno." });
        }
    }

    /**
     * Cadastra um novo aluno
     */
    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: AlunoDTO = req.body;

            if (!dadosRecebidos.nome || !dadosRecebidos.sobrenome || !dadosRecebidos.email || !dadosRecebidos.senha) {
                return res.status(400).json({ mensagem: "Nome, sobrenome, email e senha são obrigatórios." });
            }

            const novoAluno = new Aluno(
                dadosRecebidos.nome.trim(),
                dadosRecebidos.sobrenome.trim(),
                dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
                (dadosRecebidos.endereco ?? "").trim(),
                dadosRecebidos.email.trim(),
                dadosRecebidos.senha,
                dadosRecebidos.celular?.trim()
            );

            const result = await Aluno.cadastrarAluno(novoAluno);

            if (result) {
                return res.status(201).json({ mensagem: "Aluno cadastrado com sucesso." });
            }

            return res.status(400).json({ mensagem: "Não foi possível cadastrar o aluno." });

        } catch (error) {
            console.error(`Erro ao cadastrar aluno: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao cadastrar o aluno.", error: String(error) });
        }
    }

    /**
     * Remove logicamente um aluno pelo ID
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idAluno = parseInt(req.params.id as string);
            const result = await Aluno.removerAluno(idAluno);

            if (result) {
                return res.status(200).json({ mensagem: "Aluno removido com sucesso." });
            }

            return res.status(404).json({ mensagem: "Aluno não encontrado para exclusão." });

        } catch (error) {
            console.error(`Erro ao remover aluno: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao remover aluno." });
        }
    }

    /**
     * Atualiza o cadastro de um aluno
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: AlunoDTO = req.body;

            const aluno = new Aluno(
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
                dadosRecebidos.endereco ?? "",
                dadosRecebidos.email ?? "",
                dadosRecebidos.senha ?? "",
                dadosRecebidos.celular
            );

            aluno.setIdAluno(parseInt(req.params.id as string));

            const result = await Aluno.atualizarAluno(aluno);

            if (result) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            }

            return res.status(400).json({ mensagem: "Não foi possível atualizar o aluno." });

        } catch (error) {
            console.error(`Erro ao atualizar aluno: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar aluno." });
        }
    }
}

export default AlunoController;