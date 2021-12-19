let chai = require("chai");
chai.should();
const { expect } = chai;
var assert = chai.assert;
// Chai HTTP provides an interface for live integration testing of the API's.
let chaiHttp = require("chai-http");
chai.use(chaiHttp);


const server = require("../server");


describe('get main test', () => {
    it('should display message', () => {
        chai
            .request(server)
            .get("/")
            .end((err, res) => {
                expect(res.body.status).to.equals("success");
                assert.strictEqual(res.body.message, "FirstGet!");
            });

    });


});


describe('get reviews test', () => {
    it('should display message', () => {
        chai
            .request(server)
            .get("/reviews")
            .end((err, res) => {
                expect(res.body.status).to.equals("success");
                assert.strictEqual(res.body.message, "SecondGet!");
            });

    });


});