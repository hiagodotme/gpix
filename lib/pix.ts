import { CRC } from "./crc/crc";
import { IDinamic } from "./idinamic";
import { IStatic } from "./istatic";
import * as qrcode from "qrcode";
import * as fs from "fs";

export class PIX implements IDinamic, IStatic {

    private _is_unique_transaction: boolean = false
    private _key: string = ''
    private _receiver_name: string = ''
    private _receiver_city: string = ''
    private _amout: number = 0
    private _zip_code: string = ''
    private _identificator: string = ''
    private _description: string = ''
    private _location: string = ''

    private constructor() { }

    public static static(): IStatic {
        return new PIX();
    }

    public static dinamic(): IDinamic {
        return new PIX();
    }

    setLocation(location: string) {
        this._location = location.replace('https://', '')
        return this;
    }

    setKey(key: string) {
        this._key = key
        return this;
    }

    setReceiverZipCode(zipCode: string) {

        if (zipCode.length != 8)
            throw 'A quantidade de caracteres para o código postal é 8'

        this._zip_code = zipCode
        return this;
    }

    setReceiverName(name: string) {
        if (name.length > 25)
            throw 'A quantidade máxima de caracteres para o nome do recebedor é 25'

        this._receiver_name = name
        return this;
    }

    setIdentificator(identificator: string) {
        if (identificator.length > 25)
            throw 'A quantidade máxima de caracteres para o identificador é 25'
        if (identificator.match(/[^0-9|a-z]/gi))
            throw 'Utilize apenas letras e números no identificador.'

        this._identificator = identificator
        return this;
    }

    setDescription(description: string) {

        if (description.length > 50)
            throw 'A quantidade máxima de caracteres para a descrição é 50'

        this._description = description
        return this;
    }


    setReceiverCity(city: string) {
        if (city.length > 15)
            throw 'A quantidade máxima de caracteres para a cidade do recebedor é 15'

        this._receiver_city = city
        return this;
    }

    setAmount(amout: number) {

        if (amout.toFixed(2).toString().length > 13)
            throw 'A quantidade máxima de caracteres para o valor é 13'

        this._amout = amout
        return this;
    }

    isUniqueTransaction(is_unique_transaction: boolean) {
        this._is_unique_transaction = is_unique_transaction
        return this;
    }

    getBRCode() {
        let lines = []

        // Payload Format Indicator
        lines.push(this._getEMV('00', '01'))

        // Is Unique Transaction?
        lines.push(this._getEMV('01', this._is_unique_transaction ? '12' : '11'))

        // Merchant Account Information - Pix	
        if (!this._key && !this._location) {
            throw 'É necessário informar uma URL ou então uma chave pix.'
        }
        lines.push(this._getEMV('26', this._generateAccountInformation()));

        // Merchant Category Code
        lines.push(this._getEMV('52', '0000'));

        // Transaction Currency
        lines.push(this._getEMV('53', '986'));

        //Transaction Amount
        if (this._amout) {
            lines.push(this._getEMV('54', this._amout.toFixed(2)))
        }

        // Country Code
        lines.push(this._getEMV('58', 'BR'))

        // Merchant Name
        let receiver_name = this._normalizeText(this._receiver_name)
        lines.push(this._getEMV('59', receiver_name))

        // Merchant City
        let receiver_city = this._normalizeText(this._receiver_city)
        lines.push(this._getEMV('60', receiver_city))

        // Postal Code
        if (this._zip_code) {
            let zip_code = this._normalizeText(this._zip_code)
            lines.push(this._getEMV('61', zip_code))
        }

        // Additional Data Field
        lines.push(this._additionalDataField())

        lines.push(`6304`)

        // fix: nome recebedor
        const payloadString = lines.join('');
        return payloadString + CRC.computeCRC(payloadString)
    }

    async getQRCode() {
        try {
            return await qrcode.toDataURL(this.getBRCode())
        } catch (e) {
            return null
        }
    }

    async saveQRCodeFile(out: string) {
        return await new Promise(async (res, rej) => {

            let base64 = await this.getQRCode()
            if (base64 == null)
                return rej(null);

            fs.writeFile(out, base64.replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
                if (err) rej(null)
                else res(true)
            })

        })
    }


    private _normalizeText(value: string) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\[\]0-9$@%*+-\./:_]/gi, ' ')
    }


    private _generateAccountInformation(): string {
        const payload = [];
        payload.push(this._getEMV('00', 'br.gov.bcb.pix'));

        if (this._key) {
            payload.push(this._getEMV('01', this._normalizeText(this._key)));
        }
        if (this._location) {
            payload.push(this._getEMV('25', this._normalizeText(this._location)));
        }
        if (this._description) {
            payload.push(this._getEMV('02', this._normalizeText(this._description)));
        }
        return payload.join('');
    }

    private _additionalDataField() {

        if (this._identificator) {
            let identificator = this._normalizeText(this._identificator)
            let reference_label = this._getEMV('05', identificator)

            // não funciona no inter/itau.
            // let gui = this._getEMV('00', 'br.gov.bcb.brcode')
            // let version = this._getEMV('01', '1.0.0')
            // let payment_system_specific_template = this._getEMV('50', gui + version)

            return this._getEMV('62', reference_label);

        } else {
            return this._getEMV('62', this._getEMV('05', '***'));
        }

    }

    private _getEMV(id: string, string: string) {
        const len = string.length.toString().padStart(2, '0');
        return `${id}${len}${string}`;
    }

}