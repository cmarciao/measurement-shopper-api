import { randomUUID } from 'node:crypto';
import { BadRequestException } from '../errors/bad-request-exception';

export class UUID {
    private value: string;

    constructor(value: string) {
        if (!this.validateUuid(value)) {
            throw new BadRequestException('INVALID_DATA', 'O uuid está inválido');
        }
        this.value = value;
    }

    static create() {
        const uuid = randomUUID();
        return new UUID(uuid);
    }

    private validateUuid(uuid: string) {
        return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    }

    getValue() {
        return this.value;
    }
}
