// Use the mocked DB connection
jest.mock("../sql/sqlConnection");

const db = require("../sql/sqlConnection");
const {
  getContractsByCustomerUid,
  getOngoingContractsByCustomerUid,
} = require("../sql/queries/clients");

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
});
