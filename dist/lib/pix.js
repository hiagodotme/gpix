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
        return this;
    };
    PIX.prototype.setKey = function (key) {
        this._key = key;
        return this;
    };
    PIX.prototype.setReceiverZipCode = function (zipCode) {
        if (zipCode.length != 8)
            throw 'A quantidade de caracteres para o código postal é 8';
        this._zip_code = zipCode;
        return this;
    };
    PIX.prototype.setReceiverName = function (name) {
        if (name.length > 25)
            throw 'A quantidade máxima de caracteres para o nome do recebedor é 25';
        this._receiver_name = name;
        return this;
    };
    PIX.prototype.setIdentificator = function (identificator) {
        if (identificator.length > 25)
            throw 'A quantidade máxima de caracteres para o identificador é 25';
        if (identificator.match(/[^0-9|a-z]/gi))
            throw 'Utilize apenas letras e números no identificador.';
        this._identificator = identificator;
        return this;
    };
    PIX.prototype.setDescription = function (description) {
        if (description.length > 50)
            throw 'A quantidade máxima de caracteres para a descrição é 50';
        this._description = description;
        return this;
    };
    PIX.prototype.setReceiverCity = function (city) {
        if (city.length > 15)
            throw 'A quantidade máxima de caracteres para a cidade do recebedor é 15';
        this._receiver_city = city;
        return this;
    };
    PIX.prototype.setAmount = function (amout) {
        if (amout.toFixed(2).toString().length > 13)
            throw 'A quantidade máxima de caracteres para o valor é 13';
        this._amout = amout;
        return this;
    };
    PIX.prototype.isUniqueTransaction = function (is_unique_transaction) {
        this._is_unique_transaction = is_unique_transaction;
        return this;
    };
    PIX.prototype.getBRCode = function () {
        var lines = [];
        // Payload Format Indicator
        lines.push(this._getEMV('00', '01'));
        // Is Unique Transaction?
        lines.push(this._getEMV('01', this._is_unique_transaction ? '12' : '11'));
        // Merchant Account Information - Pix	
        if (!this._key && !this._location) {
            throw 'É necessário informar uma URL ou então uma chave pix.';
        }
        lines.push(this._getEMV('26', this._generateAccountInformation()));
        // Merchant Category Code
        lines.push(this._getEMV('52', '0000'));
        // Transaction Currency
        lines.push(this._getEMV('53', '986'));
        //Transaction Amount
        if (this._amout) {
            lines.push(this._getEMV('54', this._amout.toFixed(2)));
        }
        // Country Code
        lines.push(this._getEMV('58', 'BR'));
        // Merchant Name
        var receiver_name = this._normalizeText(this._receiver_name);
        lines.push(this._getEMV('59', receiver_name));
        // Merchant City
        var receiver_city = this._normalizeText(this._receiver_city);
        lines.push(this._getEMV('60', receiver_city));
        // Postal Code
        if (this._zip_code) {
            var zip_code = this._normalizeText(this._zip_code);
            lines.push(this._getEMV('61', zip_code));
        }
        // Additional Data Field
        lines.push(this._additionalDataField());
        lines.push("6304");
        // fix: nome recebedor
        var payloadString = lines.join('');
        return payloadString + crc_1.CRC.computeCRC(payloadString);
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
    PIX.prototype._normalizeText = function (value) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\[\]0-9$@%*+-\./:_]/gi, ' ');
    };
    PIX.prototype._generateAccountInformation = function () {
        var payload = [];
        payload.push(this._getEMV('00', 'br.gov.bcb.pix'));
        if (this._key) {
            payload.push(this._getEMV('01', this._normalizeText(this._key)));
        }
        if (this._location) {
            payload.push(this._getEMV('25', this._normalizeText(this._location)));
        }
        if (this._description) {
            payload.push(this._getEMV('02', this._normalizeText(this._description)));
        }
        return payload.join('');
    };
    PIX.prototype._additionalDataField = function () {
        if (this._identificator) {
            var identificator = this._normalizeText(this._identificator);
            var reference_label = this._getEMV('05', identificator);
            // não funciona no inter/itau.
            // let gui = this._getEMV('00', 'br.gov.bcb.brcode')
            // let version = this._getEMV('01', '1.0.0')
            // let payment_system_specific_template = this._getEMV('50', gui + version)
            return this._getEMV('62', reference_label);
        }
        else {
            return this._getEMV('62', this._getEMV('05', '***'));
        }
    };
    PIX.prototype._getEMV = function (id, string) {
        var len = string.length.toString().padStart(2, '0');
        return "".concat(id).concat(len).concat(string);
    };
    return PIX;
}());
exports.PIX = PIX;
