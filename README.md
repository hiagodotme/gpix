# GPIX

GPIX é um biblioteca que facilita gerar br-codes dinâmicos e estáticos.

# Exemplos de uso

```javascript
// typescript
import { PIX } from "gpix";

// javascript
const PIX = require('gpix')

let pix = new PIX();
// Exemplo 01: BRCODE estático, sem valor definido (usuário digita valor) e o identificador definido é 123
pix.setNomeRecebedor('Hiago Silva Souza')
pix.setCidadeRecebedor('Rio Preto')
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setIdentificador('DoaçãoLivre-GPIX') // opcional

console.log(pix.getBRCode())

// Exemplo 02: BRCODE estático, com valor definido
pix = new PIX();
pix.setNomeRecebedor('Hiago Silva Souza')
pix.setCidadeRecebedor('Rio Preto')
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setIdentificador('123') // opcional
pix.setCepRecebedor('15082131') // opcional
pix.setValor(5.0) // opcional

console.log(pix.getBRCode())

// Exemplo 03: BRCODE dinâmico
pix = new PIX();
pix.setNomeRecebedor('Logical Delivery LTDA')
pix.setCidadeRecebedor('Rio Preto')
pix.setCepRecebedor('15082131') // opcional
pix.setPadraoUrlPix('PADRAO.URL.PIX/0123ABCD') // URL do PSP com os dados da cobrança PIX, utilizado para integrações

console.log(pix.getBRCode())
```