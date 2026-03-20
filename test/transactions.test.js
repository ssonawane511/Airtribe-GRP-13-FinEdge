import tap from "tap";
import supertest from "supertest";
import app from "../src/app.js";
import connectDB, { closeDB } from "../src/config/database.js";

const server = supertest(app);
let authToken = null;

const createTransaction = {
  title: "Salary",
  type: "income",
  amount: 1000,
  date: new Date().toISOString(),
  notes: "Salary for the month",
};

const updateTransaction = {
  type: "expense",
  amount: 500,
  date: new Date().toISOString(),
  notes: "Food for the month",
  title: "Food for the month",
};

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

let transactionId = null;

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
  t.equal(response.status, 200);
  t.end();
});

tap.test("POST /api/v1/transactions", async (t) => {
  const response = await server
    .post("/api/v1/transactions")
    .set("Authorization", `Bearer ${authToken}`)
    .send(createTransaction);
  console.log(response.body.data);
  transactionId = response.body.data.id;
  t.equal(response.status, 201);
  t.end();
});

tap.test("GET /api/v1/transactions/summary", async (t) => {
  const response = await server
    .get("/api/v1/transactions/summary")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.end();
});

tap.test("GET /api/v1/transactions", async (t) => {
  const response = await server
    .get("/api/v1/transactions")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.end();
});

tap.test("GET /api/v1/transactions/:id", async (t) => {
  const response = await server
    .get(`/api/v1/transactions/${transactionId}`)
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /api/v1/transactions/:id", async (t) => {
  const response = await server
    .put(`/api/v1/transactions/${transactionId}`)
    .set("Authorization", `Bearer ${authToken}`)
    .send(updateTransaction);
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /api/v1/transactions/:id", async (t) => {
  const response = await server
    .delete(`/api/v1/transactions/${transactionId}`)
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.end();
});

tap.teardown(async () => {
  await closeDB();
});
