let request = require("supertest");

describe("loading express", () => {

  let server;
  beforeEach( () => {
    server = require("../dist/app.js");
  });

  afterEach( () => {
    server.close();
  });

  it("responds to /", () => {
    request(server)
      .get('/')
      .expect(200, done);
  });

});
