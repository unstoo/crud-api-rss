import * as dotenv from 'dotenv';
import { startServer } from "./server";

dotenv.config();

const configPort = parseInt(process.env.PORT ?? '');

if (!configPort) {
  process.stderr.write('Missing config data');
  process.exit(1);
}


startServer(configPort, '127.0.0.1');