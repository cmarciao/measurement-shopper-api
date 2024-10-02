import { ApiException } from './api-exception';

export class NotFoundException extends ApiException {
    constructor(erroCode: string, message: string) {
        super(404, erroCode, message);
    }
}
