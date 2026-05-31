import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const transports = [new winston.transports.Console()];

if (process.env.LOGTAIL_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_TOKEN, {
    endpoint: 'https://s1618023.eu-nbg-2.betterstackdata.com',
  });

  transports.push(new LogtailTransport(logtail));
}

export const logger = winston.createLogger({
  level: 'info',
  transports,
});
