import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import * as dotenv from 'dotenv';

import { UserRouter } from './users/user.controller';
import { matchRoute } from './utils/routing';

dotenv.config();

const port = process.env.PORT;

if (!port) {
  process.stderr.write('Missing config data');
  process.exit(1);
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const method = req.method || '';
  const url = req?.url?.slice(1) || '';

  const { error: routerError, service } = matchRoute(UserRouter, { method, url });

  if (routerError) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(routerError, null, 2));
  }

  const { error, data } = service();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify(data));
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
