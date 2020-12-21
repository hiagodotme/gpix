import { CRC } from "./crc/crc";
import { IDinamic } from "./idinamic";
import { IStatic } from "./istatic";
import * as qrcode from "qrcode"
import * as fs from "fs"

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

    private constructor() {}

    public static static(): IStatic {
        return new PIX();
    }

    public static dinamic(): IDinamic {
        return new PIX();
    }

    setLocation(location: string) {
        this._location = location.replace('https://', '')
    }

    setKey(key: string) {
        this._key = key
    }

    setReceiverZipCode(zipCode: string) {
        this._zip_code = zipCode
    }

    setReceiverName(name: string) {
        if (name.length > 25)
            throw 'A quantidade máxima de caracteres para o nome do recebedor é 25'

        this._receiver_name = name
    }

    setIdentificator(identificator: string) {
        this._identificator = identificator
    }

    setDescription(description: string) {
        this._description = description
    }


    setReceiverCity(city: string) {
        if (city.length > 15)
            throw 'A quantidade máxima de caracteres para a cidade do recebedor é 15'

        this._receiver_city = city
    }

    setAmount(amout: number) {

        if (amout.toFixed(2).toString().length > 13)
            throw 'A quantidade máxima de caracteres para o valor é 13'

        this._amout = amout
    }

    isUniqueTransaction(is_unique_transaction: boolean) {
        this._is_unique_transaction = is_unique_transaction
    }

    private _rightPad(value: number) {
        return value < 10 ? `0${value}` : value;
    }

    private _normalizeText(value: string) {
        let str = value.toUpperCase().replace('Ç','C') as any
        return str['normalize']("NFD").replace(/[^A-Z0-9$%*+-\./:]/gi, ' ')
    }

    getBRCode() {
        let lines = []

        //#region Payload Format Indicator
        lines.push(`0002 01`)
        //#endregion

        // caso seja transação única
        if (this._is_unique_transaction)
            lines.push('0102 12')

        //#region Merchant Account Information - PIX
        let description = this._normalizeText(this._description || '')
        let extra = 14 + 8;
        if(description) {
            extra += 4 + description.length
        }

        if (this._key) {
            let contentKey = this._normalizeText(this._key)
            lines.push(`26${contentKey.length + extra}`)
            lines.push(`\t0014 br.gov.bcb.pix`)
            lines.push(`\t01${this._rightPad(contentKey.length)} ${contentKey}`)
        } else if(this._location) {
            let location = this._location
            lines.push(`26${location.length + extra}`)
            lines.push(`\t0014 br.gov.bcb.pix`)
            lines.push(`\t25${this._rightPad(location.length)} ${location}`)
        } else {
            throw 'É necessário informar uma URL ou então uma chave pix.'
        }

        // descricao
        if(this._description) {
            lines.push(`\t02${this._rightPad(description.length)} ${description}`)
        }

        //#endregion

        //#region Merchant Category Code
        lines.push(`5204 0000`)
        //#endregion

        //#region Transaction Currency
        lines.push(`5303 986`) // 989 = R$
        //#endregion

        //#region Transaction Amount
        if (this._amout) {
            let valor = this._normalizeText(this._amout.toFixed(2).toString())
            if (this._amout > 0)
                lines.push(`54${this._rightPad(valor.length)} ${valor}`)
        }
        //#endregion

        //#region Country Code
        /** @length 02 */
        lines.push(`5802 BR`)
        //#endregion

        //#region Merchant Name
        let receiver_name = this._normalizeText(this._receiver_name)
        lines.push(`59${this._rightPad(receiver_name.length)} ${receiver_name}`)
        //#endregion

        //#region Merchant City
        let receiver_city = this._normalizeText(this._receiver_city)
        lines.push(`60${this._rightPad(receiver_city.length)} ${receiver_city}`)
        //#endregion

        //#region Postal Code
        if (this._zip_code) {
            let zip_code = this._normalizeText(this._zip_code)
            lines.push(`61${this._rightPad(zip_code.length)} ${zip_code}`)
        }
        //#endregion

        //#region Additional Data Field
        if (this._identificator) {
            let transaction_identificator = this._normalizeText(this._identificator)
            lines.push(`62${transaction_identificator.length + 38}`)
            lines.push(`\t05${this._rightPad(transaction_identificator.length)} ${transaction_identificator}`)
            lines.push(`\t5030`)
            lines.push(`\t\t0017 br.gov.bcb.brcode`)
            lines.push(`\t\t0105 1.0.0`)
        }
        //#endregion

        //#region Additional Data Field
        if (this._location) {
            lines.push(`6207`)
            lines.push(`\t0503 ***`)
        }
        //#endregion

        lines.push(`6304`)

        // fix: nome recebedor
        lines = lines.map(item => item.replace(' ', ''));

        let finalString = lines.join('').replace(/\t/gi, '')

        return finalString + CRC.computeCRC(finalString)
    }

    async getQRCode() {
        try {
            return await qrcode.toDataURL(this.getBRCode())
        } catch (e) {
            return null
        }
    }

    async saveQRCodeFile(out: string) {
        return await new Promise( async (res, rej) => {

            let base64 = await this.getQRCode()
            if(base64 == null)
                return rej(null);

            fs.writeFile(out,  base64.replace(/^data:image\/png;base64,/, ""), 'base64', function (err) {
                if(err) rej(null)
                else res(true)
            })

        })
    }

}