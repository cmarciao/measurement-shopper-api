import { GoogleGenerativeAI } from '@google/generative-ai';
import { UUID } from '../../domain/vo/uuid';
import { UnprocessableEntity } from '../../domain/errors/unprocessable-entity';

export type AIGateway = {
    getMeasureValue: (imageBase64: string, meterType: 'WATER' | 'GAS') => Promise<{ measureValue: number, measureUuid: string }>;
}

export class GeminiAiGateway implements AIGateway {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async getMeasureValue(imageBase64: string, meterType: 'WATER' | 'GAS'): Promise<{ measureValue: number, measureUuid: string }> {
        try {
            const generativeModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const prompt = meterType === 'WATER'
                ? 'This is a water meter, what value appears on its panel? The background or the numbers can be red or white.'
                : 'This is a gas meter, what value appears on its panel? The background or the numbers can be red or white.';
            const content = await generativeModel.generateContent([prompt, {
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/jpeg',
                }
            }]);
            const textContent = content.response.text();
            const match = textContent.match(/\d+(\.\d+)?/);
            const measureValue = match ? parseFloat(match[0]) : 0;
            const measureUuid = UUID.create().getValue();
            return { measureUuid, measureValue };
        } catch (error) {
            console.error('Gemini error:', error);
            throw new UnprocessableEntity('IMAGE_PROCESS_ERROR', 'Erro ao processar a imagem');
        }
    }
}
