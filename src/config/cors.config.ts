import { registerAs } from '@nestjs/config';
import { getEnvArray } from '@common/utils/env.util';
import { ICorsConfig } from './interfaces/cors-config.interface';

export default registerAs(
  'cors',
  (): ICorsConfig => ({
    origin: (origin, callback) => {
      const allowedOrigins = getEnvArray('CORS_ORIGIN', [
        'http://localhost:3000',
      ]);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: getEnvArray('CORS_CREDENTIALS', ['false']).includes('true'),
    allowedHeaders: getEnvArray('CORS_HEADERS', [
      'Content-Type',
      'Authorization',
    ]),
  }),
);
