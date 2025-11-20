jest.mock("../sql/sqlConnection");

const db = require("../sql/sqlConnection");
const { getPaymentByContractId } = require("../sql/queries/billingQueries");

describe("Billing queries (with mocked DB)", () => {
  beforeEach(() => {
    db.query.mockReset();
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
});
