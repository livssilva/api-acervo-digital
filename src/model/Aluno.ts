// Importa o tipo AlunoDTO, que define a "forma" dos dados de um aluno (como um molde/contrato)
import type AlunoDTO from "../dto/AlunoDTO.js";
// Importa a classe DatabaseModel, responsável por gerenciar a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel.js";

// Cria uma instância do DatabaseModel e acessa o pool de conexões com o banco de dados
// O "pool" é um conjunto de conexões reutilizáveis, mais eficiente que abrir/fechar uma por vez
const database = new DatabaseModel().pool;

// Define a classe Aluno, que representa um aluno no sistema
class Aluno {

    private id_aluno: number = 0;
    private ra: string = "";
    private nome: string;
    private sobrenome: string;
    private data_nascimento: Date;
    private endereco: string;
    private email: string;
    private senha: string;
    private celular: string;
    private status_aluno: boolean = true;

    constructor(
        _nome: string,
        _sobrenome: string,
        _data_nascimento: Date,
        _endereco: string,
        _email: string,
        _senha: string,
        _celular?: string
    ) {
        this.nome = _nome;
        this.sobrenome = _sobrenome;
        this.data_nascimento = _data_nascimento;
        this.endereco = _endereco;
        this.email = _email;
        this.senha = _senha;
        this.celular = _celular ?? "";
    }

    // ==================== GETTERS E SETTERS ====================

    public getIdAluno(): number { return this.id_aluno; }
    public setIdAluno(id_aluno: number): void { this.id_aluno = id_aluno; }

    public getRa(): string { return this.ra; }
    public setRa(ra: string): void { this.ra = ra; }

    public getNome(): string { return this.nome; }
    public setNome(nome: string): void { this.nome = nome; }

    public getSobrenome(): string { return this.sobrenome; }
    public setSobrenome(sobrenome: string): void { this.sobrenome = sobrenome; }

    public getDataNascimento(): Date { return this.data_nascimento; }
    public setDataNascimento(data_nascimento: Date): void { this.data_nascimento = data_nascimento; }

    public getEndereco(): string { return this.endereco; }
    public setEndereco(endereco: string): void { this.endereco = endereco; }

    public getEmail(): string { return this.email; }
    public setEmail(email: string): void { this.email = email; }

    public getSenha(): string { return this.senha; }
    public setSenha(senha: string): void { this.senha = senha; }

    public getCelular(): string { return this.celular; }
    public setCelular(celular: string): void { this.celular = celular; }

    // Getter/Setter duplicado do RA (mantido por compatibilidade)
    public getRA(): string { return this.ra; }
    public setRA(ra: string): void { this.ra = ra; }

    public getStatusAluno(): boolean { return this.status_aluno; }
    public setStatusAluno(status_aluno: boolean): void { this.status_aluno = status_aluno; }

    // ==================== MÉTODOS ESTÁTICOS ====================

    /**
     * Retorna uma lista com todos os alunos ativos no banco de dados
     */
    static async listarAlunos(): Promise<Array<AlunoDTO> | null> {
        try {
            const querySelectAluno = `
                SELECT id_aluno,
                       ra,
                       nome,
                       sobrenome,
                       data_nascimento,
                       endereco,
                       email,
                       celular,
                       status_aluno
                FROM Aluno
                WHERE status_aluno = TRUE;
            `;

            const respostaBD = await database.query(querySelectAluno);

            const listaDeAlunos: Array<AlunoDTO> = respostaBD.rows.map((aluno: any) => {
                const alunoDTO: AlunoDTO = {
                    id_aluno:        aluno.id_aluno,
                    ra:              aluno.ra,
                    nome:            aluno.nome,
                    sobrenome:       aluno.sobrenome,
                    data_nascimento: aluno.data_nascimento,
                    endereco:        aluno.endereco,
                    email:           aluno.email,
                    celular:         aluno.celular,
                    status_aluno:    aluno.status_aluno
                };
                return alunoDTO;
            });

            return listaDeAlunos;

        } catch (error) {
            console.error(`Erro ao acessar o modelo: ${error}`);
            throw error;
        }
    }

    /**
     * Retorna as informações de um aluno pelo ID
     */
    static async listarAluno(id_aluno: number): Promise<AlunoDTO | null> {
        try {
            const querySelectAluno = `SELECT * FROM aluno WHERE id_aluno = $1`;
            const respostaBD = await database.query(querySelectAluno, [id_aluno]);

            const alunoDTO: AlunoDTO = {
                id_aluno:        respostaBD.rows[0].id_aluno,
                nome:            respostaBD.rows[0].nome,
                sobrenome:       respostaBD.rows[0].sobrenome,
                data_nascimento: respostaBD.rows[0].data_nascimento,
                endereco:        respostaBD.rows[0].endereco,
                email:           respostaBD.rows[0].email,
                celular:         respostaBD.rows[0].celular,
                ra:              respostaBD.rows[0].ra,
                status_aluno:    respostaBD.rows[0].status_aluno
            };

            return alunoDTO;
        } catch (error) {
            console.log(`Erro ao realizar a consulta: ${error}`);
            return null;
        }
    }

    /**
     * Busca um aluno pelo e-mail
     */
    static async buscarAlunoPorEmail(email: string): Promise<AlunoDTO | null> {
        try {
            const query = `SELECT * FROM aluno WHERE email = $1 AND status_aluno = TRUE`;
            const respostaBD = await database.query(query, [email]);

            if (respostaBD.rows.length === 0) return null;

            const aluno = respostaBD.rows[0];

            const alunoDTO: AlunoDTO = {
                id_aluno:        aluno.id_aluno,
                nome:            aluno.nome,
                sobrenome:       aluno.sobrenome,
                data_nascimento: aluno.data_nascimento,
                endereco:        aluno.endereco,
                email:           aluno.email,
                celular:         aluno.celular,
                ra:              aluno.ra,
                status_aluno:    aluno.status_aluno,
                senha:           aluno.senha
            };

            return alunoDTO;
        } catch (error) {
            console.log(`Erro ao buscar aluno por email: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo aluno no banco de dados
     */
    static async cadastrarAluno(aluno: Aluno): Promise<boolean> {
        try {
            if (!aluno || !aluno.getNome || !aluno.getSobrenome) {
                console.error(`Erro ao cadastrar aluno: Objeto aluno ou propriedades indefinidas`);
                throw new Error("Objeto aluno inválido ou undefined");
            }

            const queryInsertAluno = `
                INSERT INTO Aluno (nome, sobrenome, data_nascimento, endereco, email, senha, celular)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_aluno;
            `;

            const valores = [
                aluno.getNome().toUpperCase(),
                aluno.getSobrenome().toUpperCase(),
                aluno.getDataNascimento(),
                aluno.getEndereco().toUpperCase(),
                aluno.getEmail().toLowerCase(),
                aluno.getSenha(),
                aluno.getCelular()
            ];

            const result = await database.query(queryInsertAluno, valores);

            if (result.rows.length > 0) {
                console.log(`Aluno cadastrado com sucesso. ID: ${result.rows[0].id_aluno}`);
                return true;
            }

            return false;

        } catch (error) {
            console.error(`Erro ao cadastrar aluno: ${error}`);
            return false;
        }
    }

    /**
     * Remove logicamente um aluno do banco de dados
     */
    static async removerAluno(id_aluno: number): Promise<boolean> {
        try {
            const aluno: AlunoDTO | null = await this.listarAluno(id_aluno);

            if (aluno && aluno.status_aluno) {
                const queryDeleteEmprestimoAluno = `
                    UPDATE emprestimo 
                    SET status_emprestimo_registro = FALSE
                    WHERE id_aluno=$1;
                `;
                await database.query(queryDeleteEmprestimoAluno, [id_aluno]);

                const queryDeleteAluno = `
                    UPDATE aluno 
                    SET status_aluno = FALSE
                    WHERE id_aluno=$1;
                `;
                await database.query(queryDeleteAluno, [id_aluno]);

                return true;
            }

            return false;

        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza os dados de um aluno no banco de dados
     */
    static async atualizarAluno(aluno: Aluno): Promise<boolean> {
        try {
            const alunoConsulta: AlunoDTO | null = await this.listarAluno(aluno.id_aluno);

            if (!alunoConsulta || !alunoConsulta.status_aluno) {
                return false;
            }

            const queryAtualizarAluno = `
                UPDATE Aluno
                SET nome            = $1,
                    sobrenome       = $2,
                    data_nascimento = $3,
                    endereco        = $4,
                    celular         = $5,
                    email           = $6
                WHERE id_aluno = $7;
            `;

            const valores = [
                aluno.getNome().toUpperCase(),
                aluno.getSobrenome().toUpperCase(),
                aluno.getDataNascimento(),
                aluno.getEndereco().toUpperCase(),
                aluno.getCelular(),
                aluno.getEmail().toLowerCase(),
                aluno.id_aluno
            ];

            const respostaBD = await database.query(queryAtualizarAluno, valores);

            return respostaBD.rowCount === 1;

        } catch (error) {
            console.error(`Erro ao atualizar aluno: ${error}`);
            return false;
        }
    }
}

export default Aluno;