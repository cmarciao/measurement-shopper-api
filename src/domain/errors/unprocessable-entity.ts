import { ApiException } from './api-exception';

export class UnprocessableEntity extends ApiException {
    constructor(erroCode: string, message: string) {
        super(422, erroCode, message);
    }
}
