import { ApiException } from './api-exception';

export class BadRequestException extends ApiException {
    constructor(erroCode: string, message: string) {
        super(400, erroCode, message);
    }
}
