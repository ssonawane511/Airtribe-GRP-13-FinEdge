import tap from "tap";
import supertest from "supertest";

import app from "../src/app.js";
import connectDB from "../src/config/database.js";

const server = supertest(app);
let authToken = null;
let secondAuthToken = null;

const signupUser = {
  name: "John Doe",
  email: `john.doe${Math.random()}@example.com`,
  password: "password",
  preferences: ["income", "expense"],
};

const loginUser = {
  email: signupUser.email,
  password: signupUser.password,
};

const updateUserPreferences = {
  preferences: ["income", "expense"],
};

tap.before(async () => {
  await connectDB();
});

tap.test("POST /api/v1/users/signup", async (t) => {
  const response = await server.post("/api/v1/users/signup").send(signupUser);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST /api/v1/users/login", async (t) => {
  const response = await server.post("/api/v1/users/login").send(loginUser);
  authToken = response.body.data.accessToken;
  secondAuthToken = response.body.data.accessToken;
  t.equal(response.status, 200);
  t.match(response.body.data.user, { email: signupUser.email, authVersion: 0 });
  t.end();
});

tap.test("POST /api/v1/users/login returns authVersion-aware tokens", async (t) => {
  const response = await server.post("/api/v1/users/login").send(loginUser);
  secondAuthToken = response.body.data.accessToken;
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /api/v1/users/preferences", async (t) => {
  const response = await server
    .put("/api/v1/users/preferences")
    .set("Authorization", `Bearer ${authToken}`)
    .send(updateUserPreferences);
  t.equal(response.status, 200);
  t.end();
});

tap.test("GET /api/v1/users", async (t) => {
  const response = await server
    .get("/api/v1/users/")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.equal(response.body.data.authVersion, 0);
  t.end();
});

tap.test("POST /api/v1/users/logout invalidates current and older tokens", async (t) => {
  const logoutResponse = await server
    .post("/api/v1/users/logout")
    .set("Authorization", `Bearer ${authToken}`);

  t.equal(logoutResponse.status, 200);
  t.same(logoutResponse.body.data, { loggedOut: true, authVersion: 1 });

  const invalidatedCurrentTokenResponse = await server
    .get("/api/v1/users/")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(invalidatedCurrentTokenResponse.status, 401);

  const invalidatedOlderTokenResponse = await server
    .get("/api/v1/users/")
    .set("Authorization", `Bearer ${secondAuthToken}`);
  t.equal(invalidatedOlderTokenResponse.status, 401);

  const reLoginResponse = await server.post("/api/v1/users/login").send(loginUser);
  t.equal(reLoginResponse.status, 200);

  const freshTokenResponse = await server
    .get("/api/v1/users/")
    .set("Authorization", `Bearer ${reLoginResponse.body.data.accessToken}`);
  t.equal(freshTokenResponse.status, 200);
  t.equal(freshTokenResponse.body.data.authVersion, 1);
  t.end();
});

tap.teardown(async () => {});
