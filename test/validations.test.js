var expect  = require("chai").expect;

describe("Validation tests", function() {
    // specification code
    it("Test cep length", function () {
        let { PIX } = require('../dist/index');
        
        expect(() => PIX.static().setReceiverZipCode('15015-000')).to.throw();
        expect(() => PIX.static().setReceiverZipCode('15015000')).to.not.throw();
    });


    it("Test receiver name length", function () {
        let { PIX } = require('../dist/index');
        
        expect(() => PIX.static().setReceiverName('Hiago Silva Souza Hiago Silva Souza Hiago Silva Souza Hiago Silva Souza ')).to.throw();
        expect(() => PIX.static().setReceiverName('Hiago Silva Souza')).to.not.throw();
    });

    it("Test identificator length", function () {
        let { PIX } = require('../dist/index');
        
        expect(() => PIX.static().setIdentificator('123456789123456789123456789')).to.throw();
        expect(() => PIX.static().setIdentificator('123456789')).to.not.throw();
    });

    it("Test description length", function () {
        let { PIX } = require('../dist/index');
        
        expect(() => PIX.static().setDescription('123456789123456789123456789123456789123456789123456789123456789123456789123456789')).to.throw();
        expect(() => PIX.static().setDescription('123456789')).to.not.throw();
    });

    it("Test city length", function () {
        let { PIX } = require('../dist/index');
        
        expect(() => PIX.static().setDescription('123456789123456789123456789123456789123456789123456789123456789123456789123456789')).to.throw();
        expect(() => PIX.static().setDescription('123456789')).to.not.throw();
    });

    it("Test amount length", function () {
        let { PIX } = require('../dist/index');
        
        expect(() => PIX.static().setAmount(12345678912345678912345678912345678912345678912345678912345678912345678912345.6789)).to.throw();
        expect(() => PIX.static().setDescription(10.0)).to.not.throw();
    });

});


describe("Static brcodes validation", function() {
    // specification code
});
