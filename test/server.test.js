const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const server = supertest(app);

const mockUser = {
    name: 'Clark Kent',
    email: 'clark@superman.com',
    password: 'Krypt()n8',
};

let token = '';
let transactionId = '';

// Auth tests

tap.test('POST /users/signup', async (t) => { 
    const response = await server.post('/users/signup').send(mockUser);
    t.equal(response.status, 200);
    t.end();
});

tap.test('POST /users/signup with missing email', async (t) => {
    const response = await server.post('/users/signup').send({
        name: mockUser.name,
        password: mockUser.password
    });
    t.equal(response.status, 400);
    t.end();
});

tap.test('POST /users/login', async (t) => { 
    const response = await server.post('/users/login').send({
        email: mockUser.email,
        password: mockUser.password
    });
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'token');
    token = response.body.token;
    t.end();
});

tap.test('POST /users/login with wrong password', async (t) => {
    const response = await server.post('/users/login').send({
        email: mockUser.email,
        password: 'wrongpassword'
    });
    t.equal(response.status, 401);
    t.end();
});

// Transaction tests

tap.test('POST /transactions', async (t) => {
    const response = await server.post('/transactions').set('Authorization', `Bearer ${token}`).send({
        type: 'income',
        category: 'salary',
        amount: 4000,
        date: '2026-03-01',
    });
    t.equal(response.status, 201);
    t.hasOwnProp(response.body, 'id');
    transactionId = response.body.id;
    t.end();
});

tap.test('GET /transactions', async (t) => {
    const response = await server.get('/transactions').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'transactions');
    t.ok(Array.isArray(response.body.transactions));
    t.end();
});

tap.test('GET /transactions/:id', async (t) => {
    const response = await server.get(`/transactions/${transactionId}`).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.equal(response.body.id, transactionId);
    t.end();
});

tap.test('PATCH /transactions/:id', async (t) => {
    const response = await server
        .patch(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: 4500 });
    t.equal(response.status, 200);
    t.equal(response.body.amount, 4500);
    t.end();
});

tap.test('GET /summary', async (t) => {
    const response = await server.get('/summary').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'totals');
    t.end();
});

tap.test('DELETE /transactions/:id', async (t) => {
    const response = await server
        .delete(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.end();
});

tap.test('GET /transactions without token', async (t) => {
    const response = await server.get('/transactions');
    t.equal(response.status, 401);
    t.end();
});



tap.teardown(() => {
    process.exit(0);
});
