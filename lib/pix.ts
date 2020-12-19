import { CRC } from "./crc/crc";
import { IDinamico } from "./idinamico";
import { IEstatico } from "./iestatico";
import * as qrcode from "qrcode"
import * as fs from "fs"

export class PIX implements IDinamico, IEstatico {

    private _is_transacao_unica: boolean = false
    private _chave: string = ''
    private _nome_recebedor: string = ''
    private _cidade_recebedor: string = ''
    private _valor: number = 0
    private _cep_recebedor: string = ''
    private _identificador_transacao: string = ''
    private _descricao_transacao: string = ''
    private _url_padrao_pix: string = ''

    private constructor() {}

    public static estatico(): IEstatico {
        return new PIX();
    }

    public static dinamico(): IDinamico {
        return new PIX();
    }

    setUrlPadraoPix(url_padrao_pix: string) {
        this._url_padrao_pix = url_padrao_pix
    }

    setChave(chave: string) {
        this._chave = chave
    }

    setCepRecebedor(cep: string) {
        this._cep_recebedor = cep
    }

    setNomeRecebedor(nome_recebedor: string) {
        if (nome_recebedor.length > 25)
            throw 'A quantidade máxima de caracteres para o nome do recebedor é 25'

        this._nome_recebedor = nome_recebedor
    }

    setIdentificador(identificador_transacao: string) {
        this._identificador_transacao = identificador_transacao
    }

    setDescricao(descricao_transacao: string) {
        this._descricao_transacao = descricao_transacao
    }


    setCidadeRecebedor(cidade_recebedor: string) {
        if (cidade_recebedor.length > 15)
            throw 'A quantidade máxima de caracteres para a cidade do recebedor é 15'

        this._cidade_recebedor = cidade_recebedor
    }

    setValor(valor: number) {

        if (valor.toFixed(2).toString().length > 13)
            throw 'A quantidade máxima de caracteres para o valor é 13'

        this._valor = valor
    }

    isTransacaoUnica(_is_transacao_unica: boolean) {
        this._is_transacao_unica = _is_transacao_unica
    }

    private _rightPad(value: number) {
        return value < 10 ? `0${value}` : value;
    }

    private _normalizarTexto(value: string) {
        let str = value.toUpperCase().replace('Ç','C') as any
        return str['normalize']("NFD").replace(/[^A-Z0-9$%*+-\./:]/gi, ' ')
    }

    getBRCode() {
        let lines = []

        //#region Payload Format Indicator
        lines.push(`0002 01`)
        //#endregion

        // caso seja transação única
        if (this._is_transacao_unica)
            lines.push('0102 12')

        //#region Merchant Account Information - PIX
        let descricao_transacao = this._normalizarTexto(this._descricao_transacao || '')
        let extra = 14 + 8;
        if(descricao_transacao) {
            extra += 4 + descricao_transacao.length
        }

        if (this._chave) {
            let conteudoChave = this._normalizarTexto(this._chave)
            lines.push(`26${conteudoChave.length + extra}`)
            lines.push(`\t0014 br.gov.bcb.pix`)
            lines.push(`\t01${this._rightPad(conteudoChave.length)} ${conteudoChave}`)
        } else if(this._url_padrao_pix) {
            let padraoUrl = this._url_padrao_pix
            lines.push(`26${padraoUrl.length + extra}`)
            lines.push(`\t0014 br.gov.bcb.pix`)
            lines.push(`\t25${this._rightPad(padraoUrl.length)} ${padraoUrl}`)
        } else {
            throw 'É necessário informar uma URL ou então uma chave pix.'
        }

        // descricao
        if(this._descricao_transacao) {
            lines.push(`\t02${this._rightPad(descricao_transacao.length)} ${descricao_transacao}`)
        }

        //#endregion

        //#region Merchant Category Code
        lines.push(`5204 0000`)
        //#endregion

        //#region Transaction Currency
        lines.push(`5303 986`) // 989 = R$
        //#endregion

        //#region Transaction Amount
        if (this._valor) {
            let valor = this._normalizarTexto(this._valor.toFixed(2).toString())
            if (this._valor > 0)
                lines.push(`54${this._rightPad(valor.length)} ${valor}`)
        }
        //#endregion

        //#region Country Code
        /** @length 02 */
        lines.push(`5802 BR`)
        //#endregion

        //#region Merchant Name
        let nome_recebedor = this._normalizarTexto(this._nome_recebedor)
        lines.push(`59${this._rightPad(nome_recebedor.length)} ${nome_recebedor}`)
        //#endregion

        //#region Merchant City
        let cidade_recebedor = this._normalizarTexto(this._cidade_recebedor)
        lines.push(`60${this._rightPad(cidade_recebedor.length)} ${cidade_recebedor}`)
        //#endregion

        //#region Postal Code
        if (this._cep_recebedor) {
            let codigo_postal = this._normalizarTexto(this._cep_recebedor)
            lines.push(`61${this._rightPad(codigo_postal.length)} ${codigo_postal}`)
        }
        //#endregion

        //#region Additional Data Field
        if (this._identificador_transacao) {
            let identificador_transacao = this._normalizarTexto(this._identificador_transacao)
            lines.push(`62${identificador_transacao.length + 38}`)
            lines.push(`\t05${this._rightPad(identificador_transacao.length)} ${identificador_transacao}`)
            lines.push(`\t5030`)
            lines.push(`\t\t0017 br.gov.bcb.brcode`)
            lines.push(`\t\t0105 1.0.0`)
        }
        //#endregion

        //#region Additional Data Field
        if (this._url_padrao_pix) {
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