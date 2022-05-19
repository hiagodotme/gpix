"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRC = void 0;
var table_1 = require("./table");
var CRC = /** @class */ (function () {
    function CRC() {
    }
    CRC.computeCRC = function (str) {
        var crc = 0xffff;
        var j, i;
        for (i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c > 255)
                throw new RangeError();
            j = (c ^ (crc >> 8)) & 0xff;
            crc = table_1.crcTable[j] ^ (crc << 8);
        }
        return (((crc ^ 0) & 0xffff).toString(16).toUpperCase()).padStart(4, "0");
    };
    return CRC;
}());
exports.CRC = CRC;
