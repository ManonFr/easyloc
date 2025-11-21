jest.mock("../../sql/sqlConnection");

const db = require("../../sql/sqlConnection");

const {
  createBillingTable,
  insertBilling,
  getBillingsByContract,
  updateBilling,
  deleteBilling,
} = require("../../sql/billing");

describe("Billing module (with mock DB)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock
  });

  test("createBillingTable should run the CREATE TABLE query", async () => {
    db.query.mockResolvedValueOnce();

    const result = await createBillingTable();

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS Billing")
    );
    expect(result).toBe(true);
  });

  test("insertBilling should insert a billing row", async () => {
    const billing = {
      id: 1,
      contract_id: 42,
      payment_datetime: "2025-11-21 12:00:00",
      amount: 150.0,
    };

    db.query.mockResolvedValueOnce();

    const result = await insertBilling(billing);

    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      Object.values(billing)
    );
    expect(result).toBe(true);
  });

  test("getBillingsByContract should return billings for a contract", async () => {
    const contractId = 42;
    const mockData = [
      {
        id: 1,
        contract_id: 42,
        payment_datetime: "2025-11-21 12:00:00",
        amount: 150.0,
      },
    ];

    db.query.mockResolvedValueOnce([mockData]);

    const result = await getBillingsByContract(contractId);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [contractId]);
    expect(result).toEqual(mockData);
  });

  test("updateBilling should update billing data", async () => {
    const updatedBilling = {
      id: 1,
      contract_id: 42,
      payment_datetime: "2025-11-22 14:00:00",
      amount: 200.0,
    };

    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const result = await updateBilling(updatedBilling);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE Billing"),
      [
        updatedBilling.contract_id,
        updatedBilling.payment_datetime,
        updatedBilling.amount,
        updatedBilling.id,
      ]
    );

    expect(result).toBe(true);
  });

  test("deleteBilling should return true when a row is deleted", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const result = await deleteBilling(1);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
    expect(result).toBe(true);
  });

  test("deleteBilling should return false when no row is deleted", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const result = await deleteBilling(999);

    expect(result).toBe(false);
  });
});
