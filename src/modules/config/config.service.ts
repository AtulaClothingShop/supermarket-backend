import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';

export const CONFIG = 'Config';

export const ConfigService: Provider = {
  provide: CONFIG,
  useFactory: () => {
    dotenv.config();
    return import('config');
  },
};
