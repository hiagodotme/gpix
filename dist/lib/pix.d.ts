export declare class PIX {
    private _is_transacao_unica;
    private _chave;
    private _nome_recebedor;
    private _cidade_recebedor;
    private _valor;
    private _cep_recebedor;
    private _identificador_transacao;
    private _descricao_transacao;
    private _padrao_url_pix;
    setPadraoUrlPix(padrao_url_pix: string): void;
    setChave(chave: string): void;
    setCepRecebedor(cep: string): void;
    setNomeRecebedor(nome_recebedor: string): void;
    setIdentificador(identificador_transacao: string): void;
    setDescricao(descricao_transacao: string): void;
    setCidadeRecebedor(cidade_recebedor: string): void;
    setValor(valor: number): void;
    isTransacaoUnica(_is_transacao_unica: boolean): void;
    private _rightPad;
    private _normalizarTexto;
    getBRCode(): string;
}
