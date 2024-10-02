import { BadRequestException } from '../errors/bad-request-exception';

export class Image {
    private value: string;

    constructor(value: string) {
        try {
            atob(value);
            this.value = value;
        } catch {
            throw new BadRequestException('INVALID_DATA', 'Imagem da medição inválida');
        }
    }

    getValue() {
        return this.value;
    }
}
