// Use the mocked DB connection
jest.mock("../sql/sqlConnection");

const db = require("../sql/sqlConnection");
const { getContractsByCustomerUid } = require("../sql/queries/clients");

describe("Client queries (with mock)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock before each test
  });

  test("getContractByCustomerUid shoud return mocked contracts", async () => {
    const fakeContracts = [{ id: 1, customer_uid: "abc-123", price: 400 }];
    db.query.mockResolvedValue([fakeContracts]);

    const result = await getContractsByCustomerUid("abc-123");

    expect(result).toEqual(fakeContracts);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["abc-123"]);
  });
});
