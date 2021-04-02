const expect  = require("chai").expect,
{ PIX } = require('../dist/index');

describe("Data validations", () => {
    
    describe("CEP", () => {
        it("Test valid cep length", () => expect(() => PIX.static().setReceiverZipCode('15015000')).to.not.throw())
        it("Test invalid cep length", () => expect(() => PIX.static().setReceiverZipCode('15015-000')).to.throw())
    })

    describe("Receiver Name", () => {
        it("Test valid receiver name length", () => expect(() => PIX.static().setReceiverName('Hiago Silva Souza')).to.not.throw())
        it("Test invalid receiver name length", () => expect(() => PIX.static().setReceiverName('Hiago Silva Souza Hiago Silva Souza Hiago Silva Souza Hiago Silva Souza ')).to.throw())
    })

    describe("Identificator", () => {
        it("Test valid identificator length", ()  => expect(() => PIX.static().setIdentificator('123456789')).to.not.throw())
        it("Test invalid identificator length", ()  => expect(() => PIX.static().setIdentificator('123456789123456789123456789')).to.throw())
    })

    describe("Description", () => {
        it("Test valid description length", () => expect(() => PIX.static().setDescription('123456789')).to.not.throw());
        it("Test invalid description length", () => expect(() => PIX.static().setDescription('123456789123456789123456789123456789123456789123456789123456789123456789123456789')).to.throw());
    })

    describe("City", () => {
        it("Test valid city length", () => expect(() => PIX.static().setDescription('123456789')).to.not.throw())
        it("Test invalid city length", () => expect(() => PIX.static().setDescription('123456789123456789123456789123456789123456789123456789123456789123456789123456789')).to.throw())
    })

    describe("Amount", () => {
        it("Test valid amount length", () => expect(() => PIX.static().setDescription(10.0)).to.not.throw())
        it("Test invalid amount length", () => expect(() => PIX.static().setAmount(12345678912345678912345678912345678912345678912345678912345678912345678912345.6789)).to.throw())
    })

});
