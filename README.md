# FinEdge API

FinEdge is a REST API for personal finance tracking built with Node.js, Express, and MongoDB.

It supports:
- user registration and login
- transaction management (income/expense)
- transaction filtering by category and date
- monthly financial summary
- monthly trends for the last 6 months

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT auth (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Environment management (`dotenv`)

## Folder Structure
```text
.
├── app.js
├── src
│   ├── controllers
│   │   ├── usersController.js
│   │   ├── transactionsController.js
│   │   └── summaryController.js
│   ├── middlewares
│   │   ├── authMiddleware.js
│   │   ├── requireUser.js
│   │   ├── loggerMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models
│   │   ├── usersModel.js
│   │   └── transactionModel.js
│   ├── routes
│   │   ├── userRoute.js
│   │   ├── transactionRoute.js
│   │   └── summaryRoute.js
│   ├── services
│   │   └── transactionService.js
│   └── utils
│       └── errors.js
└── README.md
```

## Environment Variables
Create `.env` file from `.env.example`.

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
MIN_PASSWORD_LENGTH=8
```

### Variable Usage
- `PORT`: server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: secret key for token sign/verify
- `JWT_EXPIRES_IN`: JWT validity duration
- `BCRYPT_SALT_ROUNDS`: password hashing cost
- `MIN_PASSWORD_LENGTH`: signup password minimum length

## Run Locally
1. Install dependencies:
```bash
npm install
```
2. Add `.env` values.
3. Start server:
```bash
npm start
```
4. API base URL:
```text
http://localhost:3000
```

## Authentication
JWT is required for all transaction and summary routes.

Header format:
```http
Authorization: Bearer <token>
```

Auth flow:
1. `POST /users/signup`
2. `POST /users/login`
3. Copy returned token and use in protected requests

## Data Models

### User
- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required, hashed)

### Transaction
- `user` (ObjectId ref User, required)
- `type` (`income` or `expense`, required)
- `category` (string, required)
- `amount` (number > 0, required)
- `date` (date, required, default now)
- `createdAt`, `updatedAt` (timestamps)

## API Reference

### 1) Signup
`POST /users/signup`

Request:
```json
{
  "name": "Clark Kent",
  "email": "clark@example.com",
  "password": "Krypt()n8"
}
```

Success (`201`):
```json
{
  "id": "USER_ID",
  "name": "Clark Kent",
  "email": "clark@example.com"
}
```

### 2) Login
`POST /users/login`

Request:
```json
{
  "email": "clark@example.com",
  "password": "Krypt()n8"
}
```

Success (`200`):
```json
{
  "token": "JWT_TOKEN"
}
```

### 3) Verify Token
`GET /users/verify-token`

Success (`200`):
```json
{
  "message": "Token is valid",
  "user": {
    "userId": "USER_ID",
    "username": "Clark Kent",
    "email": "clark@example.com",
    "iat": 0,
    "exp": 0
  }
}
```

### 4) Create Transaction
`POST /transactions`

Request:
```json
{
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2026-03-01"
}
```

Success (`201`):
```json
{
  "id": "TRANSACTION_ID",
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2026-03-01T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 5) Get All Transactions
`GET /transactions`

Supports filters:
- `category`
- `date` (single day)
- `startDate` and `endDate` (range)

Examples:
- `/transactions?category=salary`
- `/transactions?date=2026-03-01`
- `/transactions?startDate=2026-03-01&endDate=2026-03-31`
- `/transactions?category=food&startDate=2026-03-01&endDate=2026-03-31`

Success (`200`):
```json
{
  "transactions": []
}
```

### 6) Get Transaction By Id
`GET /transactions/:id`

Success (`200`):
```json
{
  "id": "TRANSACTION_ID",
  "type": "expense",
  "category": "food",
  "amount": 800,
  "date": "2026-03-02T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 7) Update Transaction
`PATCH /transactions/:id`

Request (partial fields allowed):
```json
{
  "category": "groceries",
  "amount": 900
}
```

Success (`200`): updated transaction object

### 8) Delete Transaction
`DELETE /transactions/:id`

Success (`200`):
```json
{
  "message": "Transaction deleted",
  "id": "TRANSACTION_ID"
}
```

### 9) Monthly Summary
`GET /summary?month=YYYY-MM`

Example:
- `/summary?month=2026-03`

Success (`200`):
```json
{
  "month": "2026-03",
  "totals": {
    "totalIncome": 5000,
    "totalExpense": 1200,
    "balance": 3800,
    "income": 5000,
    "expense": 1200,
    "netSavings": 3800
  }
}
```

### 10) Monthly Trends
`GET /summary/trends`

Returns trends for the last 6 months (including current month).

Success (`200`):
```json
{
  "months": 6,
  "endMonth": "2026-03",
  "trends": [
    {
      "month": "2025-10",
      "totalIncome": 0,
      "totalExpense": 0,
      "balance": 0
    }
  ]
}
```

## Error Handling
Custom errors are defined in `src/utils/errors.js` and handled centrally by `src/middlewares/errorMiddleware.js`.

Standard error response:
```json
{
  "message": "Error details"
}
```

Common status codes:
- `400` Bad Request
- `401` Unauthorized
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

## Validation Rules
- Email must be valid format
- Password length must satisfy `MIN_PASSWORD_LENGTH`
- Transaction `type` must be `income` or `expense`
- Transaction `amount` must be positive
- `month` query format must be `YYYY-MM`
- Transaction id must be valid Mongo ObjectId

## Scripts
- `npm start` - start app with nodemon
- `npm test` - run tests using tap

## Notes
- Ensure `.env` is configured before running.
- Use UTC dates for consistent month/date calculations.
