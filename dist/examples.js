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
var pix_1 = require("./lib/pix");
// Example 01: BRCODE static with defined amount.
var pix = pix_1.PIX.static()
    .setReceiverName('Hiago Silva Souza')
    .setReceiverCity('Rio Preto')
    .setKey('fcba8826-cbff-46e2-8c40-1b39896402a8')
    .setDescription('Donation with defined amount - GPIX') // opcional
    .setReceiverZipCode('15082131') // opcional
    .setIdentificator('123') // opcional
    .setAmount(5.0); // opcional
console.log('\nDonation with defined amount - GPIX >>>>\n', pix.getBRCode());
// Example 02: Static BRCODE, with no defined amount (user types amount) and the defined identifier is 123
pix = pix_1.PIX.static()
    .setReceiverName('Hiago Silva Souza')
    .setReceiverCity('Rio Preto')
    .setKey('8d9f54ec-c00b-4878-9b7d-7096e9b2c011')
    .setDescription('Donation without defined amount - GPIX'); // optional
console.log('\nDonation without defined amount - GPIX >>>>\n', pix.getBRCode());
// Example 03: BRCODE dinamic
var dpix = pix_1.PIX.dinamic()
    .setReceiverName('Minha Empresa LTDA')
    .setReceiverCity('Rio Preto')
    .setLocation('url-location-psp')
    .setAmount(10.4); // some PSP are not recovering the amount through the charge. Then temporarily enter the amount to avoid problems.
console.log('\nBRCODE dinamic - GPIX >>>>\n', dpix.getBRCode());
// Saving QRCode to physical file
// Salvando QRCode em arquivo físico
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pix.setDescription('Free Donation / QRCODE - GPIX'); // optional
                return [4 /*yield*/, pix.saveQRCodeFile('./qrcode.png')];
            case 1:
                if (_a.sent()) {
                    console.log('success in saving static QR-code');
                }
                else {
                    console.log('error saving QR-code');
                }
                return [2 /*return*/];
        }
    });
}); })();
