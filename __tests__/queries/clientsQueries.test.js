// Use the mocked DB connection
jest.mock("../../sql/sqlConnection");

const db = require("../../sql/sqlConnection");
const {
  getContractsByCustomerUid,
  getOngoingContractsByCustomerUid,
  countLateReturnsByCustomer,
  groupContractsByCustomer,
} = require("../../sql/queries/clientsQueries");

describe("Client queries (with mocked DB)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock before each test
  });

  test("getContractsByCustomerUid shoud return mocked contracts", async () => {
    const fakeContracts = [{ id: 1, customer_uid: "abc-123", price: 400 }];

    db.query.mockResolvedValue([fakeContracts]);

    const result = await getContractsByCustomerUid("abc-123");

    expect(result).toEqual(fakeContracts);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["abc-123"]);
  });

  test("getOngoingContractsByCustomerUid should return mocked ongoing contracts", async () => {
    const fakeOngoingContracts = [
      {
        id: 2,
        customer_uid: "abc-123",
        vehicle_uid: "veh-456",
        loc_begin_datetime: "2025-11-01 10:00:00",
        loc_end_datetime: "2025-11-10 10:00:00",
      },
    ];

    db.query.mockResolvedValue([fakeOngoingContracts]);

    const result = await getOngoingContractsByCustomerUid("abc-123");

    expect(result).toEqual(fakeOngoingContracts);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["abc-123"]);
  });

  test("countLateReturnsByCustomer should return number of late returns per customer", async () => {
    const fakeLateReturns = [
      { customer_uid: "abc-123", late_returns_count: 2 },
      { customer_uid: "def-456", late_returns_count: 1 },
    ];

    db.query.mockResolvedValue([fakeLateReturns]);

    const result = await countLateReturnsByCustomer();

    expect(result).toEqual(fakeLateReturns);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });

  test("groupContractsByCustomer should return contract count per customer", async () => {
    const fakeGroupedData = [
      { customer_uid: "cust-001", total_contracts: 3 },
      { customer_uid: "cust-002", total_contracts: 1 },
    ];

    db.query.mockResolvedValue([fakeGroupedData]);

    const result = await groupContractsByCustomer();

    expect(result).toEqual(fakeGroupedData);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });
});
