/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { ApiException } from '../../domain/errors/api-exception';
import { env } from '../../config/env';

export interface HttpServer {
    register(method: string, url: string, callback: (params: any, body: any, query: any) => Promise<any>): Promise<void>;
    listen(port: number, callback: () => void): void;
}

export class ExpressAdapter implements HttpServer {
    private app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(cors());
        this.app.use('/public', express.static(path.join(__dirname, '..', '..', '..', 'public')));
    }

    async register(method: string, url: string, callback: (params: any, body: any, query: any) => Promise<void>): Promise<void> {
        this.app[method](url, async function (req: Request, res: Response) {
            try {
                const output = await callback(req.params, req.body, req.query);
                res.json(output);
            } catch (e: any) {
                if (e instanceof ApiException) {
                    return res.status(e.statusCode).json({
                        error_code: e.errorCode,
                        error_description: e.message,
                    });
                }
                console.log(e);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }

    listen(port: number, callback: () => void): void {
        return this.app.listen(env.API_PORT, callback);
    }

}
