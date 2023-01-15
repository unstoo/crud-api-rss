import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import * as dotenv from 'dotenv';

import { UserRouter } from './users/user.controller';
import { matchRoute } from './utils/routing';
import { parseMethod, parseUrl, SERVICE_TO_HTTP_CODE } from './utils/helpers';

dotenv.config();

const port = process.env.PORT;

if (!port) {
  process.stderr.write('Missing config data');
  process.exit(1);
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const method = parseMethod(req.method);
  const url = parseUrl(req.url)
  const bodyChunks: any[] = [];
  req.on("data", (chunk) => {
    bodyChunks.push(chunk);
  });

  req.on("end", () => {
    res.setHeader('Content-Type', 'text/plain');
    const bodyData = Buffer.concat(bodyChunks).toString() || '{}';
    let body: Record<any, any> = {};

    try {
      body = JSON.parse(bodyData);
    } catch (parsingError) {
      res.statusCode = 400;
      return res.end('Corrupted body data.')
    }

    const {
      error: routeErr,
      service,
      validator,
      params
    } = matchRoute(UserRouter, { method, url });

    if (routeErr) {
      res.statusCode = 404;
      return res.end(routeErr.message);
    }

    const { error: validationErr, params: validatedParams } = validator({ ...params, ...body });
    if (validationErr) {
      res.statusCode = 400;
      return res.end(validationErr.message);
    }

    const { error: serviceError, result } = service!(validatedParams);

    if (serviceError) {
      res.statusCode = 500;
      return res.end(JSON.stringify(serviceError, null, 2));
    }

    if (SERVICE_TO_HTTP_CODE[result.code] === 404) {
      res.statusCode = 404;
      return res.end('Resource not found.');
    }

    res.statusCode = SERVICE_TO_HTTP_CODE[result.code];
    res.end(JSON.stringify(result.data, null, 2));
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

server.on('error', () => {
  process.stderr.write('Server error. Shutting down...');
  process.exit(1);
});

server.on('clientError', (err: NodeJS.ErrnoException, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});