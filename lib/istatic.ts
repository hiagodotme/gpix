export interface IStatic {

    setReceiverName(name: string): void;
    setReceiverCity(city: string): void;
    setReceiverZipCode(zipCode: string): void;
    setIdentificator(identificator: string): void;
    setDescription(description: string): void;
    setAmount(amount: number): void;
    setKey(key: string): void;

    getBRCode(): string;
    getQRCode(): Promise<string | null>;
    saveQRCodeFile(path: string): Promise<any>;

}