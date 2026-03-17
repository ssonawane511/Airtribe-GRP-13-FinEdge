const openapiSpecification = {
  openapi: "3.0.3",
  info: {
    title: "FinEdge API",
    version: "1.0.0",
    description: "OpenAPI documentation for the FinEdge backend.",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      UserSignupRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      UserLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      UserPreferencesRequest: {
        type: "object",
        properties: { preferences: { type: "object", additionalProperties: true } },
      },
      TransactionRequest: {
        type: "object",
        required: ["type", "amount", "date", "title"],
        properties: {
          type: { type: "string", enum: ["income", "expense"] },
          amount: { type: "number" },
          date: { type: "string", format: "date-time" },
          title: { type: "string" },
          notes: { type: "string" },
        },
      },
      BudgetRequest: {
        type: "object",
        required: ["month", "monthlyGoal", "savingsTarget"],
        properties: {
          month: { type: "string" },
          monthlyGoal: { type: "number" },
          savingsTarget: { type: "number" },
        },
      },
    },
  },
  paths: {
    "/health": { get: { tags: ["System"], summary: "Health check", responses: { 200: { description: "OK" } } } },
    "/api/v1/users": { get: { tags: ["Users"], security: [{ bearerAuth: [] }], responses: { 200: { description: "User fetched successfully" } } } },
    "/api/v1/users/signup": { post: { tags: ["Auth"], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserSignupRequest" } } } }, responses: { 201: { description: "User created successfully" } } } },
    "/api/v1/users/login": { post: { tags: ["Auth"], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserLoginRequest" } } } }, responses: { 200: { description: "User logged in successfully" } } } },
    "/api/v1/users/preferences": { put: { tags: ["Users"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserPreferencesRequest" } } } }, responses: { 200: { description: "User preferences updated successfully" } } } },
    "/api/v1/users/auth/google": { get: { tags: ["Auth"], responses: { 302: { description: "Redirect" } } } },
    "/api/v1/users/auth/google/callback": { get: { tags: ["Auth"], responses: { 200: { description: "Google authentication successful" } } } },
    "/api/v1/transactions": {
      get: { tags: ["Transactions"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Transactions fetched successfully" } } },
      post: { tags: ["Transactions"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionRequest" } } } }, responses: { 201: { description: "Transaction created successfully" } } },
    },
    "/api/v1/transactions/summary": { get: { tags: ["Transactions"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Transaction summary fetched successfully" } } } },
    "/api/v1/transactions/trend": { get: { tags: ["Transactions"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Transaction trend fetched successfully" } } } },
    "/api/v1/transactions/{id}": {
      get: { tags: ["Transactions"], security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], responses: { 200: { description: "Transaction fetched successfully" } } },
      put: { tags: ["Transactions"], security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionRequest" } } } }, responses: { 200: { description: "Transaction updated successfully" } } },
      delete: { tags: ["Transactions"], security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }], responses: { 200: { description: "Transaction deleted successfully" } } },
    },
    "/api/v1/budget": {
      get: { tags: ["Budget"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Budget fetched successfully" } } },
      put: { tags: ["Budget"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/BudgetRequest" } } }, responses: { 200: { description: "Budget updated successfully" } } } },
    },
    "/api/v1/suggest": { get: { tags: ["Suggest"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Suggest fetched successfully" } } } },
  },
};

export default openapiSpecification;
