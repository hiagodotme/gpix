import { PIX } from "./lib/pix";

// Example 01: BRCODE static with defined amount.
let pix = PIX.static();
pix.setReceiverName('Hiago Silva Souza')
pix.setReceiverCity('Rio Preto')
pix.setKey('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setDescription('Donation with defined amount - GPIX') // opcional
pix.setReceiverZipCode('15082131') // opcional
pix.setIdentificator('123') // opcional
pix.setAmount(5.0) // opcional

console.log('\nDonation with defined amount - GPIX >>>>\n', pix.getBRCode())

pix = PIX.static();
// Example 02: Static BRCODE, with no defined amount (user types amount) and the defined identifier is 123
pix.setReceiverName('Hiago Silva Souza')
pix.setReceiverCity('Rio Preto')
pix.setKey('nubank@hiago.me')
pix.setDescription('Donation without defined amount - GPIX') // optional

console.log('\nDonation without defined amount - GPIX >>>>\n', pix.getBRCode())

// Example 03: BRCODE dinamic
let dpix = PIX.dinamic();
dpix.setReceiverName('Minha Empresa LTDA')
dpix.setReceiverCity('Rio Preto')
dpix.setLocation('url-location-psp')
dpix.setAmount(10.4) // some PSP are not recovering the amount through the charge. Then temporarily enter the amount to avoid problems.
console.log('\nBRCODE dinamic - GPIX >>>>\n', dpix.getBRCode());

// Saving QRCode to physical file
// Salvando QRCode em arquivo físico
(async () => {

    pix.setDescription('Free Donation / QRCODE - GPIX') // optional

    if(await pix.saveQRCodeFile('./qrcode.png')) {
        console.log('success in saving static QR-code')
    } else {
        console.log('error saving QR-code')
    }
})();