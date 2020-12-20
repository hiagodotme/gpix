export interface IDinamic {

    setReceiverName(name: string): void;
    setReceiverCity(city: string): void;
    setReceiverZipCode(zipCode: string): void;
    setDescription(description: string): void;
    setLocation(location: string): void;
    
    getBRCode(): string;
    getQRCode(): Promise<string | null>;
    saveQRCodeFile(path: string): Promise<any>;
}