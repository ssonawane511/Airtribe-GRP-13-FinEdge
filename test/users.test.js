import tap from "tap";
import supertest from "supertest";
import app from "../src/app.js";
import connectDB from "../src/config/database.js";

const server = supertest(app);
let authToken = null;

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
  console.log(response.body);
  authToken = response.body.data.accessToken;
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
  t.end();
});

tap.teardown(async () => {
  server.close();
});