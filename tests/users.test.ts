import { get } from 'node:http';
import { strict as assert } from 'node:assert';

import { startServer } from "../src/server";


const testPort = 4000;
const testHost = '127.0.0.1';
const {
  server,
  host,
  port,
} = startServer(testPort, testHost);

server.on('listening', async () => {

  const apiUrl = 'api/users';

  process.stdout.write('\nTest suite started...\n\n');

  // Get all records with a GET api / users request(an empty array is expected)
  await itAsync('should GET api/users/ shout return list of users.', async () => {
    const result = await new Promise((resolve) => {
      get(`http://${host}:${port}/${apiUrl}`, (res) => {
        let data: any[] = [];

        res.on('data', (chunk) => {
          data.push(chunk);
        });

        res.on('close', () => {
          const json = JSON.parse(data.toString());
          resolve({
            data: json,
            statusCode: res.statusCode,
          });
        });
      });
    });

    assert.deepEqual(result, {
      statusCode: 200,
      data: [],
    });
  });

  process.stdout.write('Test suite completed.\n\n');
  process.exit(0);
})


type Fn = () => Promise<any>
async function itAsync(desc: string, fn: Fn) {
  try {
    await fn();
    process.stdout.write(`\x1b[32m\u2714\x1b[0m ${desc}`);
    process.stdout.write('\n\n');
  } catch (error) {
    process.stderr.write(`\x1b[31m\u2718\x1b[0m ${desc}`);
    process.stdout.write('\n');
    process.stderr.write(JSON.stringify(error, null, 2));
    process.stdout.write('\n');
  }
};

// A new object is created by a POST api / users request(a response containing newly created record is expected)
// With a GET api / user / { userId } request, we try to get the created record by its id(the created record is expected)
// We try to update the created record with a PUT api / users / { userId }request(a response is expected containing an updated object with the same id)
// With a DELETE api / users / { userId } request, we delete the created object by id(confirmation of successful deletion is expected)
// With a GET api / users / { userId } request, we are trying to get a deleted object by id(expected answer is that there is no such object)