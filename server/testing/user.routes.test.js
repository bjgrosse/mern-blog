const request = require("supertest");
const User = require("../models/user");
const app = require("../app.js");
const createTestDb = require("./createTestDb");

const validUser = {
  name: "Test User",
  email: "valid@email.com",
  password: "goodpassword",
  password2: "goodpassword"
};
const validUser2 = {
  name: "Test User2",
  email: "valid2@email.com",
  password: "goodpassword2",
  password2: "goodpassword2"
};

const db = createTestDb("mern-stack-test-users");
describe("Test registering a new user", () => {
  beforeAll(() => {
    db.connect();
  });

  afterAll(done => {
    db.disconnect(done);
  });

  test("It should require all fields", () => {
    return request(app)
      .post("/api/users/register")
      .send({})
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.name).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.password).toBeTruthy();
        expect(response.body.password2).toBeTruthy();
      });
  });

  test("It should require a valid email address", () => {
    return request(app)
      .post("/api/users/register")
      .send({ ...validUser, email: "notvalid" })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.email).toBeTruthy();
      });
  });

  test("It should disallow password shorter than 6 characters", () => {
    return request(app)
      .post("/api/users/register")
      .send({ ...validUser, password: "short", password2: "short" })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.password).toBeTruthy();
      });
  });

  test("It should disallow password longer than 30 characters", () => {
    return request(app)
      .post("/api/users/register")
      .send({
        ...validUser,
        password: "1234567890123456789012345678901",
        password2: "1234567890123456789012345678901"
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.password).toBeTruthy();
      });
  });

  test("It should require passwords to match", () => {
    return request(app)
      .post("/api/users/register")
      .send({ ...validUser, password2: "validbutdifferent" })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.password2).toBeTruthy();
      });
  });

  test("It should create new user with valid data", () => {
    return request(app)
      .post("/api/users/register")
      .send(validUser)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test("It should fail if email already exists", () => {
    return request(app)
      .post("/api/users/register")
      .send(validUser)
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.email).toBeTruthy();
      });
  });
});

describe("Test checking an email address for an existing user", () => {
  beforeAll(() => {
    db.connect();
  });

  afterAll(done => {
    db.disconnect(done);
  });

  test("It should return false if email doesn't exist", () => {
    return request(app)
      .post("/api/users/checkEmail")
      .send({ email: validUser.email })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.exists).toBeFalsy();
      });
  });

  test("It should return true if email exists", () => {
    return request(app)
      .post("/api/users/register")
      .send(validUser)
      .then(response => {
        return request(app)
          .post("/api/users/checkEmail")
          .send({ email: validUser.email })
          .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.exists).toBeTruthy();
          });
      });
  });
});

describe("Test logging in and getting JWT", () => {
  beforeAll(done => {
    db.connect();

    return request(app)
      .post("/api/users/register")
      .send(validUser)
      .then(response => {
        done();
      });
  });

  afterAll(done => {
    db.disconnect(done);
  });

  test("It should require a valid email address", () => {
    return request(app)
      .post("/api/users/login")
      .send({ ...validUser, email: "notvalid" })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.email).toBeTruthy();
      });
  });

  test("It should disallow password shorter than 6 characters", () => {
    return request(app)
      .post("/api/users/login")
      .send({ ...validUser, password: "short" })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.password).toBeTruthy();
      });
  });

  test("It should disallow password longer than 30 characters", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        ...validUser,
        password: "1234567890123456789012345678901"
      })
      .then(response => {
        expect(response.statusCode).toBe(403);
        expect(response.body.password).toBeTruthy();
      });
  });

  test("It should fail if email doesn't match", () => {
    return request(app)
      .post("/api/users/login")
      .send({ ...validUser, email: "wont@match.com" })
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBeTruthy();
      });
  });

  test("It should fail if password doesn't match", () => {
    return request(app)
      .post("/api/users/login")
      .send({ ...validUser, password: "wontmatch" })
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBeTruthy();
      });
  });

  test("It should succeed if credentials are correct", () => {
    return request(app)
      .post("/api/users/login")
      .send(validUser)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});

describe("Test getUserProfile", () => {
  beforeAll(done => {
    db.connect();

    return request(app)
      .post("/api/users/register")
      .send(validUser)
      .then(response => {
        done();
      });
  });

  afterAll(done => {
    db.disconnect(done);
  });

  test("It should fail if not logged in", () => {
    return request(app)
      .get("/api/users/current")
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });

  test("It should succeed if logged in", () => {
    return request(app)
      .post("/api/users/login")
      .send(validUser)
      .then(response => {
        console.log(response.body);
        let token = response.body.token;

        return request(app)
          .get("/api/users/current")
          .set("Authorization", token)
          .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.user.name).toBe(validUser.name);
            expect(response.body.user.email).toBe(validUser.email);
          });
      });
  });
});

describe("Test updating user profile", () => {
  let user1Cuid;
  let user2Cuid;

  beforeAll(done => {
    db.connect();

    return request(app)
      .post("/api/users/register")
      .send(validUser)
      .then(response => {
        user1Cuid = response.body.user.cuid;
        return request(app)
          .post("/api/users/register")
          .send(validUser2)
          .then(response => {
            user2Cuid = response.body.user.cuid;
            done();
          });
      });
  });

  afterAll(done => {
    db.disconnect(done);
  });

  test("It should fail if not logged in", () => {
    return request(app)
      .post("/api/users/update")
      .send(validUser)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });

  test("It should fail if not updating profile for logged in user", () => {
    return request(app)
      .post("/api/users/login")
      .send(validUser)
      .then(response => {
        let token = response.body.token;

        return request(app)
          .post("/api/users/update")
          .send({ ...validUser2, name: "new", cuid: user2Cuid })
          .set("Authorization", token)
          .then(response => {
            expect(response.statusCode).toBe(401);
          });
      });
  });

  test("It should succeed if logged in", () => {
    return request(app)
      .post("/api/users/login")
      .send(validUser)
      .then(response => {
        let token = response.body.token;

        return request(app)
          .post("/api/users/update")
          .send({ ...validUser, name: "new", cuid: user1Cuid })
          .set("Authorization", token)
          .then(response => {
            expect(response.statusCode).toBe(200);

            return request(app)
              .get("/api/users/current")
              .set("Authorization", token)
              .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.user.name).toBe("new");
                expect(response.body.user.email).toBe(validUser.email);
              });
          });
      });
  });
});
