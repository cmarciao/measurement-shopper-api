import { ApiException } from './api-exception';

export class ConflictException extends ApiException {
    constructor(erroCode: string, message: string) {
        super(409, erroCode, message);
    }
}
