// Importa a classe Livro do model — é daqui que vêm os métodos de acesso ao banco de dados
import Livro from "../model/Livro.js";
// Importa os tipos Request e Response do Express — representam a requisição e a resposta HTTP
import { type Request, type Response } from "express";
// Importa o tipo LivroDTO para tipar os dados recebidos do front-end
import type LivroDTO from "../dto/LivroDTO.js";

// Define a classe LivroController que HERDA da classe Livro
// A herança permite acessar os métodos estáticos do model diretamente
// O controller é responsável por receber as requisições HTTP e devolver as respostas — nunca acessa o banco diretamente
class LivroController extends Livro {

    // Método que busca todos os livros ativos e os retorna em formato JSON
    // ⚠️ Diferença dos outros controllers: este método não tem JSDoc (comentário de documentação acima dele)
    static async todos(req: Request, res: Response) {
        try {
            // Chama o método do model para buscar todos os livros com status ativo no banco
            const listaDeLivros = await Livro.listarLivros();
            // Retorna a lista em formato JSON com status HTTP 200 (OK — requisição bem-sucedida)
            return res.status(200).json(listaDeLivros);
        } catch (error) {
            // Exibe os detalhes do erro no console do servidor para facilitar o debug
            console.error(`Erro ao listar livros: ${error}`);
            // Retorna mensagem de erro com status HTTP 500 (Internal Server Error)
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações dos livros." });
        }
    }

    // Método que busca um único livro com base no ID informado na URL (ex: GET /livro/3)
    static async livro(req: Request, res: Response) {
        try {
            // Lê o parâmetro "id" da URL e converte de string para número inteiro
            const idLivro = parseInt(req.params.id as string);

            // Chama o método do model passando o ID para buscar o livro específico no banco
            const livro = await Livro.listarLivro(idLivro);
            // Retorna o objeto do livro em JSON com status HTTP 200 (OK)
            return res.status(200).json(livro);
        } catch (error) {
            // Exibe o erro no console do servidor
            console.log(`Erro ao acessar método herdado: ${error}`);
            // Retorna mensagem de erro com status HTTP 500
            // ⚠️ O comentário diz "status code 400" mas o código usa 500 — são códigos diferentes
            return res.status(500).json("Erro ao recuperar as informações do livro.");
        }
    }

    // Método que recebe os dados do front-end e cria um novo livro no banco de dados
    static async cadastrar(req: Request, res: Response) {
    try {
        // Lê o corpo da requisição tipificado como LivroDTO.
        // O front-end envia os dados do novo livro em formato JSON no body.
        const dadosRecebidos: LivroDTO = req.body;

        // Cria o objeto Livro com os dados recebidos.
        // "??" define fallbacks para campos opcionais não enviados pelo front-end.
        const novoLivro = new Livro(
            dadosRecebidos.titulo,
            dadosRecebidos.autor,
            dadosRecebidos.editora,
            (dadosRecebidos.ano_publicacao ?? 0).toString(), // number → string; fallback: "0"
            dadosRecebidos.isbn,
            dadosRecebidos.quant_total,
            dadosRecebidos.quant_disponivel,
            dadosRecebidos.quant_aquisicao,
            dadosRecebidos.valor_aquisicao ?? 0              // fallback: 0
        );

        // Persiste o novo livro no banco via model.
        const result = await Livro.cadastrarLivro(novoLivro);

        if (result) {
            // HTTP 201 — recurso criado com sucesso (correto para criação, não 200).
            return res.status(201).json({ mensagem: "Livro cadastrado com sucesso." });
        }

        // HTTP 400 — requisição válida, mas o banco não conseguiu salvar.
        return res.status(400).json({ mensagem: "Não foi possível cadastrar o livro." });

    } catch (error) {
        // console.error para erros — capturado por ferramentas de monitoramento.
        console.error(`Erro ao cadastrar livro: ${error}`);

        // HTTP 500 — erro interno inesperado do servidor.
        return res.status(500).json({ mensagem: "Erro ao cadastrar o livro." });
    }
}

    // Método que recebe um ID pela URL e realiza a remoção lógica do livro no banco
    // "Promise<Response>" indica que este método sempre retorna uma resposta HTTP ao final
   static async remover(req: Request, res: Response): Promise<Response> {
    try {
        // Lê o parâmetro "id" da URL e converte para número inteiro.
        // Ex: DELETE /livro/5 → idLivro = 5
        const idLivro = parseInt(req.params.id as string);

        // Remove logicamente o livro e seus empréstimos vinculados no banco via model.
        const result = await Livro.removerLivro(idLivro);

        if (result) {
            // HTTP 200 — remoção bem-sucedida (correto para remoção, não 201).
            return res.status(200).json({ mensagem: "Livro removido com sucesso." });
        }

        // HTTP 404 — livro não encontrado ou já estava inativo.
        return res.status(404).json({ mensagem: "Livro não encontrado para exclusão." });

    } catch (error) {
        // console.error para erros — capturado por ferramentas de monitoramento.
        console.error(`Erro ao remover livro: ${error}`);

        // HTTP 500 — erro interno inesperado do servidor.
        return res.status(500).json({ mensagem: "Erro ao remover o livro." });
    }
}

    // Método que recebe os novos dados do front-end e atualiza o cadastro do livro no banco
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Lê o parâmetro "id" da URL e converte para número inteiro
            // Exemplo de URL: PUT /livro/7  →  idLivro = 7
            const idLivro = parseInt(req.params.id as string);

            // Lê o corpo da requisição e tipifica como LivroDTO
            // O front-end envia os dados atualizados no corpo da requisição
            const dadosRecebidos: LivroDTO = req.body;

            // Cria um novo objeto Livro com os dados atualizados recebidos do front-end
            // Mesma lógica do método cadastrar — usa "??" para garantir valores padrão nos campos opcionais
            const livro = new Livro(
                dadosRecebidos.titulo,
                dadosRecebidos.autor,
                dadosRecebidos.editora,
                // Se ano_publicacao não foi informado, usa "0" como valor padrão
                (dadosRecebidos.ano_publicacao ?? 0).toString(),
                dadosRecebidos.isbn,
                dadosRecebidos.quant_total,
                dadosRecebidos.quant_disponivel,
                dadosRecebidos.quant_aquisicao,
                dadosRecebidos.valor_aquisicao ?? 0
            );

            // Define o ID do livro no objeto criado, lendo o parâmetro capturado da URL
            // Isso é necessário para que o model saiba QUAL livro deve ser atualizado no banco
            livro.setIdLivro(idLivro);

            // Chama o método do model para atualizar os dados do livro no banco de dados
            // Usa o nome "sucesso" ao invés de "result" — apenas uma diferença de nomenclatura, mesmo comportamento
            const sucesso = await Livro.atualizarLivro(livro);

            // Verifica o retorno do model: true = atualização bem-sucedida, false = falha
            if (sucesso) {
                // Retorna mensagem de sucesso com status HTTP 200 (OK)
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                // ⚠️ Diferença dos outros controllers: usa status HTTP 400 (Bad Request) ao invés de 500
                // 400 indica que a requisição foi malformada ou os dados são inválidos
                // 500 indica erro interno do servidor — semanticamente, 400 pode fazer mais sentido aqui
                return res.status(400).json({ mensagem: "Não foi possível atualizar o livro no banco de dados." });
            }
        } catch (error) {
            // Exibe o erro no console e retorna status HTTP 500 em caso de exceção inesperada
            console.error(`Erro ao atualizar livro: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar o livro." });
        }
    }
}

// Exporta a classe LivroController para que possa ser importada e usada nas rotas da aplicação
export default LivroController;