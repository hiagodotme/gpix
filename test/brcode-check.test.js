const expect  = require("chai").expect,
{ PIX } = require('../dist/index');

describe("BRCode Check's", function() {
    // specification code
    it("Check BRCode Static integrity", function () {
        let pix = PIX.static()
            .setReceiverName('Hiago Silva Souza')
            .setReceiverCity('Rio Preto')
            .setKey('fcba8826-cbff-46e2-8c40-1b39896402a8')
            .setDescription('Donation with defined amount - GPIX')
            .setReceiverZipCode('15082131')
            .setIdentificator('123')
            .setAmount(5.0)
        
        let expectedBRCode = '00020101021126970014br.gov.bcb.pix0136fcba8826-cbff-46e2-8c40-1b39896402a80235Donation with defined amount - GPIX52040000530398654045.005802BR5917Hiago Silva Souza6009Rio Preto610815082131620705031236304520D';

        expect(pix.getBRCode()).to.equals(expectedBRCode);
    });

    it("Check BRCode Dinamic integrity", function () {
        let pix = PIX.dinamic()
            .setReceiverName('Minha Empresa LTDA')
            .setReceiverCity('Rio Preto')
            .setLocation('url-location-psp')
            .setAmount(10.4)

        let expectedBRCode = '00020101021126380014br.gov.bcb.pix2516url-location-psp520400005303986540510.405802BR5918Minha Empresa LTDA6009Rio Preto62070503***6304BAFF';

        expect(pix.getBRCode()).to.equals(expectedBRCode);
    });

});
