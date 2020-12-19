export interface IDinamico {
    setNomeRecebedor(nome: string): void;
    setCidadeRecebedor(cidade: string): void;
    setCepRecebedor(cep: string): void;
    setDescricao(descricao: string): void;
    setUrlPadraoPix(url_padrao_pix: string): void;
    getBRCode(): string;
    getQRCode(): Promise<string | null>;
    saveQRCodeFile(path: string): Promise<any>;
}
