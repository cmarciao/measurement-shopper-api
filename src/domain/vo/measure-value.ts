import { BadRequestException } from '../errors/bad-request-exception';

export class MeasureValue {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    static create(value: string) {
        if (!value.match(/^\d+$/)) {
            throw new BadRequestException(
                'INVALID_DATA',
                'O valor deve ser um número'
            );
        }
        const measureValue = Number(value);
        if (measureValue < 0) {
            throw new BadRequestException(
                'INVALID_DATA',
                'O valor deve ser um valor maior que 0'
            );
        }
        return new MeasureValue(measureValue);
    }

    getValue() {
        return this.value;
    }
}
