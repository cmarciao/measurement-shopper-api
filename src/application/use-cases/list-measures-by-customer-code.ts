/* eslint-disable indent */
import { NotFoundException } from '../../domain/errors/not-found-exception';
import { MeasureType } from '../../domain/vo/measure-type';
import { inject } from '../../infra/di';
import { MeasureRepository } from '../../infra/repositories/measure-repository';

type Input = {
    customerCode: number;
    measureType?: string;
}

type Output = {
    customer_code: number;
    measures: {
        measure_uuid: string;
        measure_datetime: Date;
        measure_type: string;
        has_confirmed: boolean;
        image_url: string;
    }[];
}

export class ListMeasuresByCustomerCode {
    @inject('measureRepository')
    measureRepository?: MeasureRepository;

    async execute({ customerCode, measureType }: Input): Promise<Output> {
        let type: 'WATER' | 'GAS' | undefined = undefined;
        try {
            if (measureType) {
                type = new MeasureType(measureType || '').getValue();
            }
        } finally {
            /** Do nothing */
        }
        const measures = await this.measureRepository!.getMeasureListByCustomerCode(customerCode, type);
        if (measures?.length === 0) {
            throw new NotFoundException(
                'MEASURES_NOT_FOUND',
                'Nenhuma leitura encontrada'
            );
        }
        const mapMeasures = measures.map((measure) => ({
            measure_uuid: measure.getMeasureUuid(),
            measure_datetime: measure.getMeasureDateTime(),
            measure_type: measure.getMeasureType(),
            has_confirmed: measure.getHasConfirmed(),
            image_url: measure.getImageUrl()
        }));
        return {
            customer_code: customerCode,
            measures: mapMeasures
        };
    }
}
