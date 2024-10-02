import { inject } from '../di';
import { Measure } from '../../domain/entities/measure';
import { PrismaClient } from '@prisma/client';

export type MeasureData = Omit<Measure, 'image'>;

export type IMeasureRepository = {
    saveMeasure: (measure: MeasureData) => Promise<void>;
    updateMeasure: (measure: MeasureData) => Promise<void>;
    getMeasureByUuid(measureUuid: string): Promise<MeasureData | null>;
    getMeasureListByCustomerCode: (customerCode: number, measureType?: 'WATER' | 'GAS') => Promise<MeasureData[]>;
    getLastMeasureByCustomerCodeAndType: (customerCode: number, measureType: 'WATER' | 'GAS') => Promise<MeasureData | null>;
}

export class MeasureRepository implements IMeasureRepository {
    @inject('prisma-client')
    private prismaClient?: PrismaClient;

    async saveMeasure(measure: MeasureData) {
        const data = {
            measure_uuid: measure.getMeasureUuid(),
            customer_code: measure.getCustomerCode(),
            image_url: measure.getImageUrl(),
            has_confirmed: measure.getHasConfirmed(),
            measure_datetime: measure.getMeasureDateTime(),
            measure_type: measure.getMeasureType(),
            measure_value: measure.getMeasureValue()
        };

        await this.prismaClient?.measure.create({ data });
    }

    async updateMeasure(measure: MeasureData): Promise<void> {
        const data = {
            measure_uuid: measure.getMeasureUuid(),
            customer_code: measure.getCustomerCode(),
            image_url: measure.getImageUrl(),
            has_confirmed: measure.getHasConfirmed(),
            measure_datetime: measure.getMeasureDateTime(),
            measure_type: measure.getMeasureType(),
            measure_value: measure.getMeasureValue()
        };

        await this.prismaClient?.measure.update({
            where: {
                measure_uuid: measure.getMeasureUuid()
            },
            data
        });
    }

    async getMeasureByUuid(measureUuid: string): Promise<Measure | null> {
        const measure = await this.prismaClient!.measure.findUnique({
            where: {
                measure_uuid: measureUuid
            }
        });
        if (!measure) return null;
        return Measure.createWithImageUrl(
            measure.measure_uuid,
            measure.image_url,
            measure.customer_code,
            measure.measure_datetime.getTime(),
            measure.measure_type,
            measure.has_confirmed,
            measure.measure_value
        );
    }

    async getMeasureListByCustomerCode(customerCode: number, measureType?: 'WATER' | 'GAS'): Promise<MeasureData[]> {
        const measureList = await this.prismaClient?.measure.findMany({
            where: {
                customer_code: customerCode,
                measure_type: measureType ? measureType : {
                    in: ['WATER', 'GAS']
                }
            }
        });
        const measures: MeasureData[] = measureList?.map((measure) =>
            Measure.createWithImageUrl(
                measure.measure_uuid,
                measure.image_url,
                measure.customer_code,
                measure.measure_datetime.getTime(),
                measure.measure_type,
                measure.has_confirmed,
                measure.measure_value
            )) || [];
        return measures;
    }

    async getLastMeasureByCustomerCodeAndType(customerCode: number, measureType: 'WATER' | 'GAS'): Promise<Measure | null> {
        const measures = await this.prismaClient!.measure.findMany({
            where: {
                customer_code: customerCode,
                measure_type: measureType
            },
        });
        if (measures.length === 0) return null;
        const lastMeasure = measures[measures.length - 1];

        return Measure.createWithImageUrl(
            lastMeasure.measure_uuid,
            lastMeasure.image_url,
            lastMeasure.customer_code,
            lastMeasure.measure_datetime.getTime(),
            lastMeasure.measure_type,
            lastMeasure.has_confirmed,
            lastMeasure.measure_value
        );
    };
}
