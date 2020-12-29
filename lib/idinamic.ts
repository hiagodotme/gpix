export interface IDinamic {

    setReceiverName(name: string): void;
    setReceiverCity(city: string): void;
    setReceiverZipCode(zipCode: string): void;
    // setDescription(description: string): void;

    /** @fixme Some PSP are not recovering the amount through the charge. Then temporarily enter the amount to avoid problems. */
    setAmount(amount: number): void;

    setLocation(location: string): void;
    
    getBRCode(): string;
    getQRCode(): Promise<string | null>;
    saveQRCodeFile(path: string): Promise<any>;
}