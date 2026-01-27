# EasyLoc – Data Access Layer (DAL)

This project is a modular Data Access Layer built for the EasyLoc car rental application.

It is part of a **projet fil rouge** in the DWWM training program.

---

## Objective

Build a **reusable and secure library** that connects to two types of databases:

- A **SQL database (MySQL)** for managing:
  - Rental contracts (`Contract`)
  - Payments (`Billing`)

- A **NoSQL database (MongoDB)** for managing:
  - Customers
  - Vehicles

---

## Features Implemented

### Local development with Docker Compose

To run both MongoDB and MySQL locally, you can use the provided docker-compose.yml file:

```bash
docker-compose up -d
```

This will start:

- A **MongoDB** server on port `27017`
- A **MySQL** server on port `3306`

The credentials are already configured in the `.env` file.
Make sure to run the table creation scripts before using the DAL modules.

---

### MySQL (Contract & Billing modules)

- CRUD operations implemented for:
  - `Contract` table
  - `Billing` table
- Managed through the `mysql2/promise` package
- All SQL functions use `async/await` syntax
- Errors are handled using `try/catch` blocks in each function

---

### MongoDB (Vehicle & Customer modules)

- CRUD operations implemented for:
  - `Customer` collection
  - `Vehicle` collection
- Unique identifiers (`uid`) are generated using the `uuid` package
- Each operation includes proper error handling via `try/catch`

---

## Unit Testing

All database access modules are tested with **Jest**:

- MongoDB modules tested with a real DB instance
- SQL modules tested using `jest.mock` and mocked responses
- One test file per module (`*.test.js`)
- Mocks stored in `__mocks__/sqlConnection.js`

Tests are organized by module type. You can run them all at once or target specific folders using the npm test command with arguments.

```bash
# Run all tests
npm test

# Run only tests inside the queries module
npm test queries

# Run only SQL tests
npm test sql

# Run only MongoDB tests
npm test mongo
```

---

### Project Structure

easyloc-dal/
├── mongo/
│ ├── customer.js # MongoDB Customer operations
│ ├── vehicle.js # MongoDB Vehicle operations
│ └── mongoConnection.js # MongoDB client connection
│
├── sql/
│ ├── sqlConnection.js # MySQL connection
│ ├── contract.js # Base CRUD for Contract table
│ ├── billing.js # Base CRUD for Billing table
│ └── queries/
│ ├── billingQueries.js # Advanced billing queries
│ ├── clientsQueries.js # Queries per customer
│ ├── delayQueries.js # Late return related queries
│ └── vehicleQueries.js # Vehicle-based queries
│
├── tests/
│ └── ... # One test file per module
│
├── **mocks**/
│ └── sqlConnection.js # Mocked SQL connection for unit testing
│
├── .env # Environment variables (ignored by Git)
├── .gitignore
├── package.json
└── README.md

---

### Code Architecture Choices

- SQL and NoSQL separation by responsibility (MongoDB for flexible entities like vehicles and customers, SQL for relational data like contracts and billing).
- Modular code organization: each domain has its own file with scoped functions.
- Separation between base CRUD and advanced queries (via `/queries` folder).
- Testability: all database logic is isolated in functions to allow mocking and unit testing.
