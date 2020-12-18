import { PIX } from "./lib/pix";

let pix = new PIX();
// Exemplo 01: BRCODE estático, sem valor definido (usuário digita valor) e o identificador definido é 123
pix.setNomeRecebedor('Hiago Silva Souza')
pix.setCidadeRecebedor('Rio Preto')
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setDescricao('Doação Livre - GPIX') // opcional

console.log('Doação Livre - GPIX >>>>\n', pix.getBRCode())

// Exemplo 02: BRCODE estático, com valor definido
pix = new PIX();
pix.setNomeRecebedor('Hiago Silva Souza')
pix.setCidadeRecebedor('Rio Preto')
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setIdentificador('123') // opcional
pix.setCepRecebedor('15082131') // opcional
pix.setDescricao('Doação com valor fixo - GPIX') // opcional
pix.setValor(5.0) // opcional

console.log('\nDoação com valor fixo - GPIX >>>>\n', pix.getBRCode())



// Exemplo 03: BRCODE dinâmico
pix = new PIX();
pix.setNomeRecebedor('Logical Delivery LTDA')
pix.setCidadeRecebedor('Rio Preto')
// pix.setCepRecebedor('15082131') // opcional
// pix.setDescricao('Fatura 01') // opcional
pix.setValor(0.10)
pix.setPadraoUrlPix('url-location-instituicao')
console.log(pix.getBRCode())
console.log('\nBRCODE dinâmico - GPIX >>>>\n', pix.getBRCode())

