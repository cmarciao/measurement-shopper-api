/* eslint-disable indent */
import { inject } from '../../infra/di';
import { Measure } from '../../domain/entities/measure';
import { MeasureRepository } from '../../infra/repositories/measure-repository';
import { GeminiAiGateway } from '../../infra/gateways/gemini-ai-gateway';
import { ConflictException } from '../../domain/errors/conflict-exception';
import { FileSystem } from '../../infra/files/file-system';

type Input = {
    image: string;
    customer_code: number;
    measure_datetime: number;
    measure_type: 'WATER' | 'GAS';
}

type Output = {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
}

export class UploadMeasure {
    @inject('measureRepository')
    measureRepository?: MeasureRepository;
    @inject('gemini-ai-gateway')
    geminiAiGateway?: GeminiAiGateway;
    @inject('file-system')
    fileSystem?: FileSystem;

    async execute({ image, customer_code, measure_datetime, measure_type }: Input): Promise<Output> {
        const measure = Measure.create(image, customer_code, measure_datetime, measure_type);
        const measureData = await this.measureRepository!.getLastMeasureByCustomerCodeAndType(customer_code, measure_type);
        if (measureData) {
            if (
                measureData.getMeasureDateTime().getMonth() === measure.getMeasureDateTime().getMonth() &&
                measureData.getMeasureDateTime().getFullYear() === measure.getMeasureDateTime().getFullYear()
            ) {
                throw new ConflictException('DOUBLE_REPORT', 'Leitura do mês já realizada');
            }
        }
        const { measureUuid, measureValue } = await this.geminiAiGateway!.getMeasureValue(
            measure.getImageBase64(),
            measure.getMeasureType()
        );
        const imageUrl = this.fileSystem!.saveImage(measure.getImageBase64(), measureUuid);
        measure.setImageUrl(imageUrl);
        measure.setMeasureValue(measureValue);
        await this.measureRepository?.saveMeasure(measure);
        return {
            image_url: imageUrl,
            measure_value: measureValue,
            measure_uuid: measureUuid,
        };
    }
}
