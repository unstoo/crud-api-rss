import { get, request } from 'node:http';
import { strict as assert } from 'node:assert';

import { startServer } from "../src/server";
import { UserDTO } from '../src/repository';


const testPort = 4000;
const testHost = '127.0.0.1';
const {
  server,
  host,
  port,
} = startServer(testPort, testHost);

server.on('listening', async () => {

  const usersURL = `http://${host}:${port}/api/users`;

  const userData: UserDTO = {
    username: 'marucs_aurelius',
    age: 1192,
    hobbies: ['vini', 'vidi', 'vici'],
  };

  let createdUserData: UserDTO | undefined;

  process.stdout.write('\nTest suite has started...\n\n');

  // Get all records with a GET api / users request(an empty array is expected)
  await itAsync('GET api/users/ should return list of users.', async () => {
    const result = await new Promise((resolve) => {
      get(usersURL, (res) => {
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

  // A new object is created by a POST api / users request(a response containing newly created record is expected)
  await itAsync('POST api/users/ should create a new user.', async () => {
    const result: {
      statusCode?: number;
      data?: UserDTO;
    } = await new Promise((resolve, reject) => {
      const dataString = JSON.stringify(userData);

      const options = {
        hostname: testHost,
        port: testPort,
        path: '/api/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataString)
        },
      };
      let data: any[] = [];

      const req = request(options, (res) => {

        res.on('data', (chunk) => {
          data.push(chunk);
        });

        res.on('close', () => {
          const json = JSON.parse(data.length ? data.toString() : '[ "no_body" ]');
          resolve({
            data: json,
            statusCode: res.statusCode,
          });
        });
      });

      req.on('error', (err) => {
        reject(err)
      })

      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request time out'))
      })

      req.write(dataString)
      req.end()
    });

    createdUserData = result.data;

    assert.deepEqual(result, {
      statusCode: 201,
      data: {
        ...userData,
        id: createdUserData!.id,
      },
    });
  });

  // With a GET api / user / { userId } request, we try to get the created record by its id(the created record is expected)
  await itAsync('GET `api/users/uuid` should return a created user.', async () => {
    const result = await new Promise((resolve) => {
      get(usersURL + `/${createdUserData!.id}`, (res) => {
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
      data: createdUserData,
    });
  });

  process.stdout.write('\nTest suite has completed.\n\n');
  process.exit(0);
})


type Fn = () => Promise<any>
async function itAsync(desc: string, fn: Fn) {
  try {
    await fn();
    process.stdout.write(`\x1b[32m\u2714\x1b[0m ${desc}`);
    process.stdout.write('\n');
  } catch (error) {
    process.stderr.write(`\x1b[31m\u2718\x1b[0m ${desc}`);
    process.stdout.write('\n');
    process.stderr.write(JSON.stringify(error, null, 2));
    process.stdout.write('\n');
  }
};
