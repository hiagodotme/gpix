export interface IStatic {
    setReceiverName(name: string): IStatic;
    setReceiverCity(city: string): IStatic;
    setReceiverZipCode(zipCode: string): IStatic;
    setIdentificator(identificator: string): IStatic;
    setDescription(description: string): IStatic;
    setAmount(amount: number): IStatic;
    setKey(key: string): IStatic;
    isUniqueTransaction(is_unique_transaction: boolean): IStatic;
    getBRCode(): string;
    getQRCode(): Promise<string | null>;
    saveQRCodeFile(path: string): Promise<any>;
}
