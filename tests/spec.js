var request = require("supertest");
describe("loading express", function () {
    var server;
    beforeEach(function () {
        server = require("../dist/app.js");
    });
    afterEach(function () {
        server.close();
    });
    it("responds to /", function () {
        request(server)
            .get('/')
            .expect(200, done);
    });
});
