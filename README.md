# GPIX

GPIX é um biblioteca que facilita a geração de br-codes dinâmicos e estáticos para o arranjo PIX.

# Como utilizar

Primeiro instale a biblioteca:

```sh
npm i gpix
```

Depois instâncie o `PIX.estatico` ou o `PIX.dinamico` e siga os exemplos abaixo


```javascript
const { PIX } = require('gpix/dist');

// Exemplo 01: BRCODE estático, com valor definido
let pix = PIX.estatico();
pix.setNomeRecebedor('Hiago Silva Souza')
pix.setCidadeRecebedor('Rio Preto')
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setIdentificador('123') // opcional
pix.setCepRecebedor('15082131') // opcional
pix.setDescricao('Doação com valor fixo - GPIX') // opcional
pix.setValor(5.0) // opcional

console.log('\nDoação com valor fixo - GPIX >>>>\n', pix.getBRCode())

pix = PIX.estatico();
// Exemplo 02: BRCODE estático, sem valor definido (usuário digita valor) e o identificador definido é 123
pix.setNomeRecebedor('Hiago Silva Souza')
pix.setCidadeRecebedor('Rio Preto')
pix.setChave('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setDescricao('Doação Livre - GPIX') // opcional

console.log('Doação Livre - GPIX >>>>\n', pix.getBRCode())


// Exemplo 03: BRCODE dinâmico
let dpix = PIX.dinamico();
dpix.setNomeRecebedor('Logical Delivery LTDA')
dpix.setCidadeRecebedor('Rio Preto')
dpix.setUrlPadraoPix('url-location-instituicao')
console.log('\nBRCODE dinâmico - GPIX >>>>\n', dpix.getBRCode());

// Gerando QRCodes em base64
(async () => {

    //console.log('QRCODE Estático >>> ', await pix.getQRCode())
    //console.log('QRCODE Dinamico >>> ', await dpix.getQRCode())

})();

// Salvando QRCode em arquivo físico
(async () => {

    pix.setDescricao('Doacao Livre / QRCODE - GPIX') // opcional


    if(await pix.saveQRCodeFile('./qrcode.png')) {
        console.log('sucesso ao salvar qr-code estático')
    } else {
        console.log('erro ao salvar qr-code')
    }
})();
```

# Essa lib te ajudou?

Se essa lib te ajudou fique a vontade para fazer uma doação =), pode ser R$ 0.50 hahahaha. Para isso basta ler o qrcode abaixo, ele foi gerado com o arquivo de exemplo da lib.

![QRCode Doação](https://github.com/hiagodotme/gpix/blob/main/qrcode.png?raw=true)


# Autor

Hiago Silva Souza <<hiasilva@gmail.com>> | https://hiago.me/