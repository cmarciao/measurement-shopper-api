/* eslint-disable indent */
import { ConflictException } from '../../domain/errors/conflict-exception';
import { NotFoundException } from '../../domain/errors/not-found-exception';
import { UUID } from '../../domain/vo/uuid';
import { inject } from '../../infra/di';
import { MeasureRepository } from '../../infra/repositories/measure-repository';

type Input = {
    measure_uuid: string;
    confirmed_value: number;
}

type Output = {
    success: boolean;
}

export class ConfirmMeasure {
    @inject('measureRepository')
    measureRepository?: MeasureRepository;

    async execute({ measure_uuid, confirmed_value }: Input): Promise<Output> {
        const uuid = new UUID(measure_uuid).getValue();
        const measure = await this.measureRepository!.getMeasureByUuid(uuid);
        if (!measure) {
            throw new NotFoundException(
                'MEASURE_NOT_FOUND',
                'Leitura do mês já realizada'
            );
        }
        if (measure.getHasConfirmed()) {
            throw new ConflictException(
                'CONFIRMATION_DUPLICATE',
                'Leitura do mês já realizada'
            );
        }
        if (measure.getMeasureValue() !== confirmed_value) {
            measure.setMeasureValue(confirmed_value);
        }
        measure.confirmMeasure();
        await this.measureRepository?.updateMeasure(measure);
        return {
            success: true
        };
    }
}
