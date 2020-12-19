"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pix_1 = require("./lib/pix");
var pix = pix_1.PIX.estatico();
// Exemplo 01: BRCODE estático, sem valor definido (usuário digita valor) e o identificador definido é 123
pix.setNomeRecebedor('Hiago Silva Souza');
pix.setCidadeRecebedor('Rio Preto');
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8');
pix.setDescricao('Doação Livre - GPIX'); // opcional
console.log('Doação Livre - GPIX >>>>\n', pix.getBRCode());
// Exemplo 02: BRCODE estático, com valor definido
pix = pix_1.PIX.estatico();
pix.setNomeRecebedor('Hiago Silva Souza');
pix.setCidadeRecebedor('Rio Preto');
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8');
pix.setIdentificador('123'); // opcional
pix.setCepRecebedor('15082131'); // opcional
pix.setDescricao('Doação com valor fixo - GPIX'); // opcional
pix.setValor(5.0); // opcional
console.log('\nDoação com valor fixo - GPIX >>>>\n', pix.getBRCode());
// Exemplo 03: BRCODE dinâmico
var dpix = pix_1.PIX.dinamico();
dpix.setNomeRecebedor('Logical Delivery LTDA');
dpix.setCidadeRecebedor('Rio Preto');
// dpix.setCepRecebedor('15082131') // opcional
// dpix.setDescricao('Fatura 01') // opcional
// dpix.setValor(0.10)
dpix.setUrlPadraoPix('url-location-instituicao');
console.log('\nBRCODE dinâmico - GPIX >>>>\n', dpix.getBRCode());
