import { BadRequestException } from '../errors/bad-request-exception';

export class MeasureType {
    private value: 'WATER' | 'GAS';

    constructor(value: string) {
        if (value !== 'WATER' && value !== 'GAS') {
            throw new BadRequestException('INVALID_DATA', 'Tipo de medição inválido');
        }
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}
