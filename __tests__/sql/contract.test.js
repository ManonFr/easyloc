// Use the mocked DB connection
jest.mock("../../sql/sqlConnection");

const db = require("../../sql/sqlConnection");
const {
  createContractTable,
  insertContract,
  getContractById,
  updateContract,
  deleteContract,
} = require("../../sql/contract");

describe("Contract module (with mock DB)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset the DB mock before each test
  });

  test("createContractTable should execute the CREATE TABLE query", async () => {
    db.query.mockResolvedValueOnce(); // Simulate success

    await createContractTable();

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS Contract")
    );
  });

  test("insertContract should insert contract data into the database", async () => {
    const fakeContract = {
      id: 1,
      vehicle_uid: "veh-456",
      customer_uid: "cust-123",
      sign_datetime: "2025-11-19 10:00:00",
      loc_begin_datetime: "2025-11-20 10:00:00",
      loc_end_datetime: "2025-11-25 10:00:00",
      returning_datetime: null,
      price: 300.0,
    };

    db.query.mockResolvedValue([{ insertId: 1 }]);

    const result = await insertContract(fakeContract);

    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      Object.values(fakeContract)
    );
    expect(result).toEqual({ id: 1, ...fakeContract });
  });

  test("getContractById should return the contract with given ID", async () => {
    const contractId = 42;
    const mockContract = {
      id: 42,
      customer_uid: "cust-123",
      vehicle_uid: "veh-456",
      sign_datetime: "2025-11-19 10:00:00",
      loc_begin_datetime: "2025-11-20 10:00:00",
      loc_end_datetime: "2025-11-25 10:00:00",
      returning_datetime: null,
      price: 300.0,
    };

    db.query.mockResolvedValue([[mockContract]]);

    const result = await getContractById(contractId);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [contractId]);
    expect(result).toEqual(mockContract);
  });

  test("updateContract should call DB with correct update query and values", async () => {
    const updatedContract = {
      id: 42,
      customer_uid: "cust-789",
      vehicle_uid: "veh-999",
      sign_datetime: "2025-12-01 09:00:00",
      loc_begin_datetime: "2025-12-02 10:00:00",
      loc_end_datetime: "2025-12-05 18:00:00",
      returning_datetime: null,
      price: 420.0,
    };

    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    await updateContract(updatedContract);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE Contract"),
      [
        updatedContract.vehicle_uid,
        updatedContract.customer_uid,
        updatedContract.sign_datetime,
        updatedContract.loc_begin_datetime,
        updatedContract.loc_end_datetime,
        updatedContract.returning_datetime,
        updatedContract.price,
        updatedContract.id,
      ]
    );
  });

  test("deleteContract should call DB with correct DELETE query", async () => {
    const contractId = 42;

    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    await deleteContract(contractId);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM Contract"),
      [contractId]
    );
  });
});
