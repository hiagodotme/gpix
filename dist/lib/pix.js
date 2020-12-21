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
        this._is_unique_transaction = false;
        this._key = '';
        this._receiver_name = '';
        this._receiver_city = '';
        this._amout = 0;
        this._zip_code = '';
        this._identificator = '';
        this._description = '';
        this._location = '';
    }
    PIX.static = function () {
        return new PIX();
    };
    PIX.dinamic = function () {
        return new PIX();
    };
    PIX.prototype.setLocation = function (location) {
        this._location = location.replace('https://', '');
    };
    PIX.prototype.setKey = function (key) {
        this._key = key;
    };
    PIX.prototype.setReceiverZipCode = function (zipCode) {
        this._zip_code = zipCode;
    };
    PIX.prototype.setReceiverName = function (name) {
        if (name.length > 25)
            throw 'A quantidade máxima de caracteres para o nome do recebedor é 25';
        this._receiver_name = name;
    };
    PIX.prototype.setIdentificator = function (identificator) {
        this._identificator = identificator;
    };
    PIX.prototype.setDescription = function (description) {
        this._description = description;
    };
    PIX.prototype.setReceiverCity = function (city) {
        if (city.length > 15)
            throw 'A quantidade máxima de caracteres para a cidade do recebedor é 15';
        this._receiver_city = city;
    };
    PIX.prototype.setAmount = function (amout) {
        if (amout.toFixed(2).toString().length > 13)
            throw 'A quantidade máxima de caracteres para o valor é 13';
        this._amout = amout;
    };
    PIX.prototype.isUniqueTransaction = function (is_unique_transaction) {
        this._is_unique_transaction = is_unique_transaction;
    };
    PIX.prototype._rightPad = function (value) {
        return value < 10 ? "0" + value : value;
    };
    PIX.prototype._normalizeText = function (value) {
        var str = value.toUpperCase().replace('Ç', 'C');
        return str['normalize']("NFD").replace(/[^A-Z0-9$%*+-\./:]/gi, ' ');
    };
    PIX.prototype.getBRCode = function () {
        var lines = [];
        //#region Payload Format Indicator
        lines.push("0002 01");
        //#endregion
        // caso seja transação única
        if (this._is_unique_transaction)
            lines.push('0102 12');
        //#region Merchant Account Information - PIX
        var description = this._normalizeText(this._description || '');
        var extra = 14 + 8;
        if (description) {
            extra += 4 + description.length;
        }
        if (this._key) {
            var contentKey = this._normalizeText(this._key);
            lines.push("26" + (contentKey.length + extra));
            lines.push("\t0014 br.gov.bcb.pix");
            lines.push("\t01" + this._rightPad(contentKey.length) + " " + contentKey);
        }
        else if (this._location) {
            var location_1 = this._location;
            lines.push("26" + (location_1.length + extra));
            lines.push("\t0014 br.gov.bcb.pix");
            lines.push("\t25" + this._rightPad(location_1.length) + " " + location_1);
        }
        else {
            throw 'É necessário informar uma URL ou então uma chave pix.';
        }
        // descricao
        if (this._description) {
            lines.push("\t02" + this._rightPad(description.length) + " " + description);
        }
        //#endregion
        //#region Merchant Category Code
        lines.push("5204 0000");
        //#endregion
        //#region Transaction Currency
        lines.push("5303 986"); // 989 = R$
        //#endregion
        //#region Transaction Amount
        if (this._amout) {
            var valor = this._normalizeText(this._amout.toFixed(2).toString());
            if (this._amout > 0)
                lines.push("54" + this._rightPad(valor.length) + " " + valor);
        }
        //#endregion
        //#region Country Code
        /** @length 02 */
        lines.push("5802 BR");
        //#endregion
        //#region Merchant Name
        var receiver_name = this._normalizeText(this._receiver_name);
        lines.push("59" + this._rightPad(receiver_name.length) + " " + receiver_name);
        //#endregion
        //#region Merchant City
        var receiver_city = this._normalizeText(this._receiver_city);
        lines.push("60" + this._rightPad(receiver_city.length) + " " + receiver_city);
        //#endregion
        //#region Postal Code
        if (this._zip_code) {
            var zip_code = this._normalizeText(this._zip_code);
            lines.push("61" + this._rightPad(zip_code.length) + " " + zip_code);
        }
        //#endregion
        //#region Additional Data Field
        if (this._identificator) {
            var transaction_identificator = this._normalizeText(this._identificator);
            lines.push("62" + (transaction_identificator.length + 38));
            lines.push("\t05" + this._rightPad(transaction_identificator.length) + " " + transaction_identificator);
            lines.push("\t5030");
            lines.push("\t\t0017 br.gov.bcb.brcode");
            lines.push("\t\t0105 1.0.0");
        }
        //#endregion
        //#region Additional Data Field
        if (this._location) {
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
