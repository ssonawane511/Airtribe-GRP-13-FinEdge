import tap from "tap";
import supertest from "supertest";
import app from "../src/app.js";
import connectDB, { closeDB } from "../src/config/database.js";

const server = supertest(app);
let authToken = null;

const signupUser = {
  name: "Budget User",
  email: `budget.user${Math.random()}@example.com`,
  password: "password",
  preferences: ["income", "expense"],
};

const loginUser = {
  email: signupUser.email,
  password: signupUser.password,
};

const budgetPayload = {
  monthlyGoal: 5000,
  savingsTarget: 1500,
};

const budgetWithMonth = {
  month: "2025-03",
  monthlyGoal: 6000,
  savingsTarget: 2000,
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
  t.equal(response.status, 200);
  t.end();
});

tap.test("GET /api/v1/budget (no budget set)", async (t) => {
  const response = await server
    .get("/api/v1/budget")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.ok(
    response.body.data.monthlyGoal === 0 &&
      response.body.data.savingsTarget === 0,
  );
  t.end();
});

tap.test("PUT /api/v1/budget - set goal and savings", async (t) => {
  const response = await server
    .put("/api/v1/budget")
    .set("Authorization", `Bearer ${authToken}`)
    .send(budgetPayload);
  t.equal(response.status, 200);
  t.equal(response.body.data.monthlyGoal, 5000);
  t.equal(response.body.data.savingsTarget, 1500);
  t.end();
});

tap.test("GET /api/v1/budget - fetch budget", async (t) => {
  const response = await server
    .get("/api/v1/budget")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.equal(response.body.data.monthlyGoal, 5000);
  t.equal(response.body.data.savingsTarget, 1500);
  t.end();
});

tap.test("PUT /api/v1/budget - update for specific month", async (t) => {
  const response = await server
    .put("/api/v1/budget")
    .set("Authorization", `Bearer ${authToken}`)
    .send(budgetWithMonth);
  t.equal(response.status, 200);
  t.equal(response.body.data.month, "2025-03");
  t.equal(response.body.data.monthlyGoal, 6000);
  t.equal(response.body.data.savingsTarget, 2000);
  t.end();
});

tap.test("GET /api/v1/budget?month=2025-03", async (t) => {
  const response = await server
    .get("/api/v1/budget?month=2025-03")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(response.status, 200);
  t.equal(response.body.data.monthlyGoal, 6000);
  t.equal(response.body.data.savingsTarget, 2000);
  t.end();
});

tap.teardown(async () => {
  await closeDB();
});
