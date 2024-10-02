import { DateTime } from '../vo/date-time';
import { Image } from '../vo/image';
import { MeasureType } from '../vo/measure-type';
import { MeasureValue } from '../vo/measure-value';
import { UUID } from '../vo/uuid';

export class Measure {
    private measureId: UUID;
    private imageBase64: Image;
    private imageUrl: string;
    private customerCode: number;
    private hasConfirmed: boolean;
    private measureDateTime: DateTime;
    private measureType: MeasureType;
    private measureValue?: MeasureValue;

    constructor(
        measureId: string,
        image: string,
        customerCode: number,
        measureDateTime: number,
        measureType: string,
        hasConfirmed: boolean,
        imageUrl: string,
        measureValue?: number,
    ) {
        this.measureId = new UUID(measureId);
        this.imageBase64 = new Image(image);
        this.customerCode = customerCode;
        this.measureDateTime = new DateTime(measureDateTime);
        this.measureType = new MeasureType(measureType);
        this.hasConfirmed = hasConfirmed;
        this.imageUrl = imageUrl;
        if (measureValue) {
            this.measureValue = new MeasureValue(measureValue);
        }
    }

    static create(
        image: string,
        customerCode: number,
        measureDateTime: number,
        measureType: string,
        measureValue?: number
    ) {
        const uuid = UUID.create();

        return new Measure(
            uuid.getValue(),
            image,
            customerCode,
            measureDateTime,
            measureType,
            false,
            '',
            measureValue
        );
    }

    static createWithImageUrl(
        measureId: string,
        imageUrl: string,
        customerCode: number,
        measureDateTime: number,
        measureType: string,
        hasConfirmed: boolean,
        measureValue?: number
    ) {
        return new Measure(
            measureId,
            '',
            customerCode,
            measureDateTime,
            measureType,
            hasConfirmed,
            imageUrl,
            measureValue
        );
    }

    getMeasureUuid() {
        return this.measureId.getValue();
    }

    getImageBase64() {
        return this.imageBase64.getValue();
    }

    getCustomerCode() {
        return this.customerCode;
    }

    getMeasureDateTime() {
        return this.measureDateTime.getValue();
    }

    getMeasureType() {
        return this.measureType.getValue();
    }

    getHasConfirmed() {
        return this.hasConfirmed;
    }

    setImageUrl(imageUrl: string) {
        this.imageUrl = imageUrl;
    }

    getImageUrl() {
        return this.imageUrl!;
    }

    setMeasureValue(measureValue: number) {
        this.measureValue = new MeasureValue(measureValue);
    }

    getMeasureValue() {
        return this.measureValue!.getValue();
    }

    confirmMeasure() {
        this.hasConfirmed = true;
    }
}
