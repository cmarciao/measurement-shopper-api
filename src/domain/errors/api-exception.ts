export class ApiException extends Error {
    constructor(
        readonly statusCode: number,
        readonly errorCode: string,
        message: string,
    ) {
        super();
        this.message = message;
    }
}
