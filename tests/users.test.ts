import { startServer } from "../src";

// Launch server
const testPort = 4000;
const testHost = '127.0.0.1';
const {
  server,
  host,
  port,
} = startServer(testPort, testHost);


// Get all records with a GET api / users request(an empty array is expected)
// A new object is created by a POST api / users request(a response containing newly created record is expected)
// With a GET api / user / { userId } request, we try to get the created record by its id(the created record is expected)
// We try to update the created record with a PUT api / users / { userId }request(a response is expected containing an updated object with the same id)
// With a DELETE api / users / { userId } request, we delete the created object by id(confirmation of successful deletion is expected)
// With a GET api / users / { userId } request, we are trying to get a deleted object by id(expected answer is that there is no such object)