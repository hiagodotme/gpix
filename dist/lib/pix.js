"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIX = void 0;
var crc_1 = require("./crc/crc");
var PIX = /** @class */ (function () {
    function PIX() {
        this._is_transacao_unica = false;
        this._chave = '';
        this._nome_recebedor = '';
        this._cidade_recebedor = '';
        this._valor = 0;
        this._cep_recebedor = '';
        this._identificador_transacao = '';
        this._descricao_transacao = '';
        this._padrao_url_pix = '';
    }
    PIX.prototype.setPadraoUrlPix = function (padrao_url_pix) {
        this._padrao_url_pix = padrao_url_pix;
    };
    PIX.prototype.setChave = function (chave) {
        this._chave = chave;
    };
    PIX.prototype.setCepRecebedor = function (cep) {
        this._cep_recebedor = cep;
    };
    PIX.prototype.setNomeRecebedor = function (nome_recebedor) {
        if (nome_recebedor.length > 25)
            throw 'A quantidade máxima de caracteres para o nome do recebedor é 25';
        this._nome_recebedor = nome_recebedor;
    };
    PIX.prototype.setIdentificador = function (identificador_transacao) {
        this._identificador_transacao = identificador_transacao;
    };
    PIX.prototype.setDescricao = function (descricao_transacao) {
        this._descricao_transacao = descricao_transacao;
    };
    PIX.prototype.setCidadeRecebedor = function (cidade_recebedor) {
        if (cidade_recebedor.length > 15)
            throw 'A quantidade máxima de caracteres para a cidade do recebedor é 15';
        this._cidade_recebedor = cidade_recebedor;
    };
    PIX.prototype.setValor = function (valor) {
        if (valor.toFixed(2).toString().length > 13)
            throw 'A quantidade máxima de caracteres para o valor é 13';
        this._valor = valor;
    };
    PIX.prototype.isTransacaoUnica = function (_is_transacao_unica) {
        this._is_transacao_unica = _is_transacao_unica;
    };
    PIX.prototype._rightPad = function (value) {
        return value < 10 ? "0" + value : value;
    };
    PIX.prototype._normalizarTexto = function (value) {
        var str = value.toUpperCase().replace('Ç', 'C');
        return str['normalize']("NFD").replace(/[^A-Z0-9$%*+-\./:]/gi, ' ');
    };
    PIX.prototype.getBRCode = function () {
        var lines = [];
        //#region Payload Format Indicator
        lines.push("0002 01");
        //#endregion
        // caso seja transação única
        if (this._is_transacao_unica)
            lines.push('0102 12');
        //#region Merchant Account Information - PIX
        var descricao_transacao = this._normalizarTexto(this._descricao_transacao || '');
        var extra = 14 + 8;
        if (descricao_transacao) {
            extra += 4 + descricao_transacao.length;
        }
        if (this._chave) {
            var conteudoChave = this._normalizarTexto(this._chave);
            lines.push("26" + (conteudoChave.length + extra));
            lines.push("\t0014 br.gov.bcb.pix");
            lines.push("\t01" + this._rightPad(conteudoChave.length) + " " + conteudoChave);
        }
        else if (this._padrao_url_pix) {
            var padraoUrl = this._padrao_url_pix;
            lines.push("26" + (padraoUrl.length + extra));
            lines.push("\t0014 br.gov.bcb.pix");
            lines.push("\t25" + this._rightPad(padraoUrl.length) + " " + padraoUrl);
        }
        else {
            throw 'É necessário informar uma URL ou então uma chave pix.';
        }
        // descricao
        if (this._descricao_transacao) {
            lines.push("\t02" + this._rightPad(descricao_transacao.length) + " " + descricao_transacao);
        }
        //#endregion
        //#region Merchant Category Code
        lines.push("5204 0000");
        //#endregion
        //#region Transaction Currency
        lines.push("5303 986"); // 989 = R$
        //#endregion
        //#region Transaction Amount
        if (this._valor) {
            var valor = this._normalizarTexto(this._valor.toFixed(2).toString());
            if (this._valor > 0)
                lines.push("54" + this._rightPad(valor.length) + " " + valor);
        }
        //#endregion
        //#region Country Code
        /** @length 02 */
        lines.push("5802 BR");
        //#endregion
        //#region Merchant Name
        var nome_recebedor = this._normalizarTexto(this._nome_recebedor);
        lines.push("59" + this._rightPad(nome_recebedor.length) + " " + nome_recebedor);
        //#endregion
        //#region Merchant City
        var cidade_recebedor = this._normalizarTexto(this._cidade_recebedor);
        lines.push("60" + this._rightPad(cidade_recebedor.length) + " " + cidade_recebedor);
        //#endregion
        //#region Postal Code
        if (this._cep_recebedor) {
            var codigo_postal = this._normalizarTexto(this._cep_recebedor);
            lines.push("61" + this._rightPad(codigo_postal.length) + " " + codigo_postal);
        }
        //#endregion
        //#region Additional Data Field
        if (this._identificador_transacao) {
            var identificador_transacao = this._normalizarTexto(this._identificador_transacao);
            lines.push("62" + (identificador_transacao.length + 38));
            lines.push("\t05" + this._rightPad(identificador_transacao.length) + " " + identificador_transacao);
            lines.push("\t5030");
            lines.push("\t\t0017 br.gov.bcb.brcode");
            lines.push("\t\t0105 1.0.0");
        }
        //#endregion
        //#region Additional Data Field
        if (this._padrao_url_pix) {
            lines.push("6207");
            lines.push("\t0503 ***");
        }
        //#endregion
        lines.push("6304");
        // fix: nome recebedor
        lines = lines.map(function (item) { return item.replace(' ', ''); });
        var finalString = lines.join('').replace(/\t/gi, '');
        return finalString + crc_1.CRC.computeCRC(finalString);
    };
    return PIX;
}());
exports.PIX = PIX;
