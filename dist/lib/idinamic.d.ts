export interface IDinamic {
    setReceiverName(name: string): IDinamic;
    setReceiverCity(city: string): IDinamic;
    setReceiverZipCode(zipCode: string): IDinamic;
    /** @fixme Some PSP are not recovering the amount through the charge. Then temporarily enter the amount to avoid problems. */
    setAmount(amount: number): IDinamic;
    setLocation(location: string): IDinamic;
    getBRCode(): string;
    getQRCode(): Promise<string | null>;
    saveQRCodeFile(path: string): Promise<any>;
}
