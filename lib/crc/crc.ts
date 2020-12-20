import { crcTable } from "./table";

export class CRC {

    static computeCRC(str: string): string {
        let crc = 0xffff;
        let j, i;
        for (i = 0; i < str.length; i++) {
          const c = str.charCodeAt(i);
          if (c > 255) throw new RangeError();
          j = (c ^ (crc >> 8)) & 0xff;
          crc = crcTable[j] ^ (crc << 8);
        }

        return (((crc ^ 0) & 0xffff).toString(16).toUpperCase()).padStart(4, "0");
    }
}