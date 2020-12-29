# GPIX

GPIX is a library that facilitates the generation of dynamic and static br-codes for the central bank of Brazil PIX arrangement.

# How to use

First install the library:

```sh
npm i gpix
```

Then start with `PIX.static()` or `PIX.dinamic()` and follow the examples below:


```javascript
const { PIX } = require('gpix/dist');

// Example 01: BRCODE static with defined amount.
let pix = PIX.static();
pix.setReceiverName('Hiago Silva Souza')
pix.setReceiverCity('Rio Preto')
pix.setReceiverZipCode('15082131') // optional
pix.setKey('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setIdentificator('123') // optional
pix.setDescription('Donation with defined amount - GPIX') // optional
pix.setAmount(5.0) // optional

console.log('\nDonation with defined amount - GPIX >>>>\n', pix.getBRCode())

pix = PIX.static();
// Example 02: Static BRCODE, with no defined amount (user types amount) and the defined identifier is 123
pix.setReceiverName('Hiago Silva Souza')
pix.setReceiverCity('Rio Preto')
pix.setKey('fcba8826-cbff-46e2-8c40-1b39896402a8')
pix.setDescription('Donation without defined amount - GPIX') // optional

console.log('Donation without defined amount - GPIX >>>>\n', pix.getBRCode())


// Example 03: BRCODE dinamic
let dpix = PIX.dinamic();
dpix.setReceiverName('Minha Empresa LTDA')
dpix.setReceiverCity('Rio Preto')
dpix.setLocation('url-location-psp')
dpix.setAmount(10.4) // some PSP are not recovering the amount through the charge. Then temporarily enter the amount to avoid problems.
console.log('\nBRCODE dinamic - GPIX >>>>\n', dpix.getBRCode());

// Generating QRCode in base64
(async () => {

    //console.log('QRCODE Static >>> ', await pix.getQRCode())
    //console.log('QRCODE Dinamic >>> ', await dpix.getQRCode())

})();

// Saving QRCode to physical file
(async () => {

    pix.setDescription('Free Donation / QRCODE - GPIX') // optional


    if(await pix.saveQRCodeFile('./qrcode.png')) {
        console.log('success in saving static QR-code')
    } else {
        console.log('error saving QR-code')
    }
})();
```

# Did this lib help you?

If this lib helped you feel free to make a donation =), it can be R$ 0.50 hahahaha. To do so, just read the qrcode below, it was generated with the lib sample file.

![QRCode Doação](https://github.com/hiagodotme/gpix/blob/main/qrcode.png?raw=true)

# Author

Hiago Silva Souza <<hiasilva@gmail.com>> | https://hiago.me/
