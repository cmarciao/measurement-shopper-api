import fs from 'node:fs';
import path from 'node:path';
import { env } from '../../config/env';

type IFileSystem = {
    saveImage: (imageBase64: string, imageUuid: string) => string;
}

export class FileSystem implements IFileSystem {
    saveImage(imageBase64: string, imageUuid: string): string {
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const imagePath = path.join(__dirname, '..', '..', '..', 'public', `${imageUuid}.jpg`);
        if (!fs.existsSync(path.dirname(imagePath))) {
            fs.mkdirSync(path.dirname(imagePath), { recursive: true });
        }
        fs.writeFileSync(imagePath, imageBuffer);
        return `http://localhost:${env.API_PORT}/public/${imageUuid}.jpg`;
    };
}
