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

const parseUrl = (url: string | undefined): string => {
  if (url === '/') return '/'
  if (!url || url.length === 0) return '';

  let parsedUrl = url.startsWith('/') ? url.slice(1) : url;
  parsedUrl = parsedUrl.endsWith('/') ? parsedUrl.slice(0, -1) : parsedUrl;
  return parsedUrl;
}

const parseMethod = (method: string | undefined) => method || '';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const method = parseMethod(req.method);
  const url = parseUrl(req.url)

  const {
    error: routerError,
    service,
    validator,
    params
  } = matchRoute(UserRouter, { method, url });

  if (routerError) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(routerError, null, 2));
  }

  const { error: validatorError, params: validatedParams } = validator(params);
  if (validatorError) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(validatorError, null, 2));
  }

  const { error: serviceError, data } = service(validatedParams);

  if (serviceError) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    return res.end(JSON.stringify(serviceError, null, 2));
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify(data, null, 2));
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
