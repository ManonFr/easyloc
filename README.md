# EasyLoc – Data Access Layer (DAL)

This project is a modular Data Access Layer built for the EasyLoc' car rental application.

It is part of a **projet fil rouge** in the DWWM training program.

---

## Objective

Build a **reusable and secure library** that connects to two types of databases:

- A **SQL database (MySQL)** for managing:

  - Rental contracts (`Contract`)
  - Payments (`Billing`) ← not yet implemented

- A **NoSQL database (MongoDB)** for managing:
  - Customers
  - Vehicles

---

## Features implemented so far

### Secure SQL connection

- Credentials stored in a `.env` file (host, port, user, password, database)
- Managed through the `mysql2/promise` package

### `Contract` table operations

- ✔️ Create the `Contract` table if it doesn't exist
- ✔️ Insert a new contract (with current or custom dates)
- ✔️ Retrieve a contract by its unique ID
- ✔️ Update an existing contract
- ✔️ Delete a contract

---

## Project structure (current)

easyloc-dal/
├── sql/
│ ├── sqlConnection.js # Handles MySQL connection using dotenv
│ └── contract.js # Contract table CRUD operations
├── index.js # Manual test script (temporary)
├── .env # Environment variables (ignored by Git)
├── .gitignore # Prevents .env and other sensitive files from being tracked
├── package.json
└── README.md

---

## About `index.js`

The `index.js` file is **only used for manual testing** during development.
