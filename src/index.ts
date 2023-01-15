import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import * as dotenv from 'dotenv';

import { UserRouter } from './users/user.controller';
import { matchRoute } from './utils/routing';
import { parseMethod, parseUrl } from './utils/helpers';

dotenv.config();

const port = process.env.PORT;

if (!port) {
  process.stderr.write('Missing config data');
  process.exit(1);
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const method = parseMethod(req.method);
  const url = parseUrl(req.url)

  const {
    error: routingErr,
    service,
    validator,
    params
  } = matchRoute(UserRouter, { method, url });

  if (routingErr) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(routingErr, null, 2));
  }

  const { error: validationErr, params: validatedParams } = validator(params);
  if (validationErr) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(validationErr, null, 2));
  }

  const { error: serviceError, data } = service(validatedParams);

  if (serviceError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(serviceError, null, 2));
  }

  if (data === undefined) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Resource not found.');
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify(data, null, 2));
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
