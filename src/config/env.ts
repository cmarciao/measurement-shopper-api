import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url().default('postgresql://root:root@db:5432/shopper'),
    API_PORT: z.number().default(3000),
    GEMINI_API_KEY: z.string().min(1, 'AI api key inválida'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Validation error of environment variables:', parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsedEnv.data;
