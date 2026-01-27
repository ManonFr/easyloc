// Use the mocked DB connection
jest.mock("../../sql/sqlConnection");

const db = require("../../sql/sqlConnection");
const {
  getPaymentByContractId,
  isContractFullyPaid,
  getUnpaidContracts,
} = require("../../sql/queries/billingQueries");

describe("Billing queries (with mocked DB)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock before each test
  });

  test("getPaymentByContractId should return list of payments for a contract", async () => {
    const fakePayments = [
      {
        id: 1,
        contract_id: 10,
        amount: 300,
        payment_datetime: "2025-11-01 12:00:00",
      },
      {
        id: 2,
        contract_id: 10,
        amount: 150,
        payment_datetime: "2025-11-02 15:30:00",
      },
    ];

    db.query.mockResolvedValue([fakePayments]);

    const result = await getPaymentByContractId(10);

    expect(result).toEqual(fakePayments);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [10]);
  });

  test("isContractFullyPaid should return true if paid amount >= contract price", async () => {
    db.query.mockResolvedValue([[{ is_paid: 1 }]]);

    const result = await isContractFullyPaid(42);

    expect(result).toBe(true);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [42, 42]);
  });

  test("isContractFullyPaid should return false if paid amount < contract price", async () => {
    db.query.mockResolvedValue([[{ is_paid: 0 }]]);

    const result = await isContractFullyPaid(42);

    expect(result).toBe(false);
  });

  test("getUnpaidContracts should return contracts with unpaid balances", async () => {
    const unpaidContracts = [
      { id: 1, customer_uid: "abc-123", price: 500, total_paid: 300 },
      { id: 2, customer_uid: "def-456", price: 800, total_paid: 700 },
    ];

    db.query.mockResolvedValue([unpaidContracts]);

    const result = await getUnpaidContracts();

    expect(result).toEqual(unpaidContracts);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });
});
