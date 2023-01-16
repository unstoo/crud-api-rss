import * as dotenv from 'dotenv';
import cluster from 'node:cluster';
import net from 'node:net';
import { cpus, EOL } from 'node:os';
import process from 'node:process';
import { startServer } from './server';

dotenv.config();

const configPort = parseInt(process.env.PORT ?? '');

if (!configPort) {
  process.stderr.write('Missing config data.\n');
  process.exit(1);
}

const cpusCount = cpus().length;

const getNextRobinIndex = ((lastIndex: number) => {
  let currentIndex = 0;
  return () => {
    if (currentIndex === lastIndex) {
      currentIndex = 0;
      return lastIndex;
    } else {
      const index = currentIndex;
      currentIndex += 1;
      return index;
    }
  }
})(cpusCount - 1);

if (cluster.isPrimary) {
  process.stdout.write(`Primary ${process.pid} is running.\n`);

  const workers: any[] = [];
  for (let i = 0; i < cpusCount; i++) {
    const uniquePort = configPort + i + 1;
    const worker = cluster.fork({
      PORT: uniquePort,
    });

    workers.push({
      worker,
      port: uniquePort
    });
  }

  workers.forEach(w => w.worker.on('message', ({ type, data }: any) => {
    process.stdout.write(`IPC action:${type} from worker on PORT ${w.port}\n`);

    workers.forEach(workerForBroadcast => {
      if (w.port !== workerForBroadcast.port) {
        workerForBroadcast.worker.process.send({ type, data });
      }
    });
  }));

  // Create an HTTP tunneling proxy
  // In this case it is an HTTP server
  const server = net.createServer();
  server.on('connection', (clientToProxySocket) => {
    const nextPort = workers[getNextRobinIndex()].port;
    clientToProxySocket.once('data', (data) => {
      let serverAddress = data.toString().split('Host: ')[1].split(EOL)[0].split(':')[0];

      let proxyToServerSocket = net.createConnection(
        {
          host: serverAddress,
          port: nextPort,
        },
      );

      proxyToServerSocket.write(data);

      clientToProxySocket.pipe(proxyToServerSocket);
      proxyToServerSocket.pipe(clientToProxySocket);
    })
  });

  server.on('error', () => {
    process.stderr.write('Some internal server error occurred\n');
  });

  server.on('close', () => {
    process.stdout.write('Client disconnected\n');
  });

  server.listen(configPort, '127.0.0.1', () => {
    process.stdout.write(`Proxy server running on ${configPort}\n`);
  });

  cluster.on('exit', (worker) => {
    process.stdout.write(`worker ${worker.process.pid} died\n`);
  });
} else {
  startServer(configPort, '127.0.0.1');
  process.stdout.write(`Worker ${process.pid} started on PORT ${configPort}\n`);
}
