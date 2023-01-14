import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

if (!port) {
  process.stderr.write('Missing config data');
  process.exit(1);
}



const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello RSShool');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});