export interface IEstatico {
    setNomeRecebedor(nome: string): void;
    setCidadeRecebedor(cidade: string): void;
    setCepRecebedor(cep: string): void;
    setIdentificador(identificador_transacao: string): void;
    setDescricao(descricao: string): void;
    setValor(valor: number): void;
    setChave(chave: string): void;
    getBRCode(): string;
}
