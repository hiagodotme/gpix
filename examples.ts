import { PIX } from "./lib/pix";

// Example 01: BRCODE static with defined amount.
let pix = PIX.static()
    .setReceiverName('Hiago Silva Souza')
    .setReceiverCity('Rio Preto')
    .setKey('fcba8826-cbff-46e2-8c40-1b39896402a8')
    .setDescription('Donation with defined amount - GPIX') // opcional
    .setReceiverZipCode('15082131') // opcional
    .setIdentificator('123') // opcional
    .setAmount(5.0) // opcional

console.log('\nDonation with defined amount - GPIX >>>>\n', pix.getBRCode())

// Example 02: Static BRCODE, with no defined amount (user types amount) and the defined identifier is 123
pix = PIX.static()
    .setReceiverName('Hiago Silva Souza')
    .setReceiverCity('Rio Preto')
    .setKey('8d9f54ec-c00b-4878-9b7d-7096e9b2c011')
    .setDescription('Donation without defined amount - GPIX') // optional

console.log('\nDonation without defined amount - GPIX >>>>\n', pix.getBRCode())

// Example 03: BRCODE dinamic
let dpix = PIX.dinamic()
    .setReceiverName('Minha Empresa LTDA')
    .setReceiverCity('Rio Preto')
    .setLocation('url-location-psp')
    .setAmount(10.4) // some PSP are not recovering the amount through the charge. Then temporarily enter the amount to avoid problems.

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