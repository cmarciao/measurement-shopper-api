import { BadRequestException } from '../errors/bad-request-exception';

export class DateTime {
    private value: Date;

    constructor(value: number) {
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) throw new BadRequestException('INVALID_DATA', 'Data inválida');
            this.value = date;
        } catch {
            throw new BadRequestException('INVALID_DATA', 'Data inválida');
        }
    }

    getValue() {
        return this.value;
    }
}
