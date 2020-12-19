"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIX = void 0;
var crc_1 = require("./crc/crc");
var qrcode = require("qrcode");
var fs = require("fs");
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
        this._url_padrao_pix = '';
    }
    PIX.estatico = function () {
        return new PIX();
    };
    PIX.dinamico = function () {
        return new PIX();
    };
    PIX.prototype.setUrlPadraoPix = function (url_padrao_pix) {
        this._url_padrao_pix = url_padrao_pix;
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
        else if (this._url_padrao_pix) {
            var padraoUrl = this._url_padrao_pix;
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
        if (this._url_padrao_pix) {
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
    PIX.prototype.getQRCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, qrcode.toDataURL(this.getBRCode())];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PIX.prototype.saveQRCodeFile = function (out) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
                            var base64;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getQRCode()];
                                    case 1:
                                        base64 = _a.sent();
                                        if (base64 == null)
                                            return [2 /*return*/, rej(null)];
                                        fs.writeFile(out, base64.replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
                                            if (err)
                                                rej(null);
                                            else
                                                res(true);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PIX;
}());
exports.PIX = PIX;
