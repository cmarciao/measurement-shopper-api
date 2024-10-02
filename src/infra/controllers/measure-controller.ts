/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfirmMeasure } from '../../application/use-cases/confirm-measure';
import { ListMeasuresByCustomerCode } from '../../application/use-cases/list-measures-by-customer-code';
import { UploadMeasure } from '../../application/use-cases/upload-measure';
import { BadRequestException } from '../../domain/errors/bad-request-exception';
import { MeasureType } from '../../domain/vo/measure-type';
import { inject } from '../di';
import { HttpServer } from '../http/http-server';

export class MeasureController {
    @inject('http-server')
    private httpServer?: HttpServer;
    @inject('upload-measure')
    private uploadMeasure?: UploadMeasure;
    @inject('confirm-measure')
    private confirMeasure?: ConfirmMeasure;
    @inject('list-measures-by-customer-code')
    private listMeasuresByCustomerCode?: ListMeasuresByCustomerCode;

    constructor() {
        this.httpServer?.register('post', '/', async (_params: any, body: any) => {
            if (typeof body.customer_code !== 'number') {
                throw new BadRequestException(
                    'INVALID_DATA',
                    'O código está inválido'
                );
            }
            return this.uploadMeasure?.execute(body);
        });

        this.httpServer?.register('patch', '/', async (_params: any, body: any) => {
            const { measure_uuid, confirmed_value } = body;
            if (!measure_uuid) {
                throw new BadRequestException(
                    'INVALID_DATA',
                    'O id da medição é obrigatório'
                );
            }
            if (!confirmed_value) {
                throw new BadRequestException(
                    'INVALID_DATA',
                    'O valor de confirmação é obrigatório'
                );
            }
            if (confirmed_value) {
                if (typeof confirmed_value !== 'number') {
                    throw new BadRequestException(
                        'INVALID_DATA',
                        'O valor deve ser um número'
                    );
                }
                if (confirmed_value < 0) {
                    throw new BadRequestException(
                        'INVALID_DATA',
                        'O valor deve ser um valor maior que 0'
                    );
                }
            }
            const output = await this.confirMeasure?.execute({ measure_uuid, confirmed_value });
            return output;
        });

        this.httpServer?.register('get', '/:customer_code/list', async (params: any, body: any, query: any) => {
            let measure_type: string | undefined;
            if (query.measure_type) {
                measure_type = new MeasureType(query.measure_type).getValue();
            }
            const { customer_code } = params;
            if (!customer_code.match(/^\d+$/)) {
                throw new BadRequestException(
                    'INVALID_DATA',
                    'O código está inválido'
                );
            }
            const output = await this.listMeasuresByCustomerCode?.execute({
                customerCode: Number(customer_code),
                measureType: measure_type
            });
            return output;
        });
    }
}
