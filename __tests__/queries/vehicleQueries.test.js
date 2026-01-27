// Use the mocked DB connection
jest.mock("../../sql/sqlConnection");

const db = require("../../sql/sqlConnection");
const {
  getContractsByVehicleUid,
  groupContractsByVehicle,
} = require("../../sql/queries/vehicleQueries");

describe("Vehicle queries (with mocked DB)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock before each test
  });

  test("getContractsByVehicleUid should return all contracts for a given vehicle", async () => {
    const fakeContracts = [
      {
        id: 1,
        customer_uid: "cust-123",
        sign_datetime: "2025-03-01 10:00:00",
        loc_begin_datetime: "2025-03-01 10:00:00",
        loc_end_datetime: "2025-03-05 10:00:00",
        returning_datetime: "2025-03-05 12:00:00",
        price: 300.0,
      },
    ];

    db.query.mockResolvedValue([fakeContracts]);

    const result = await getContractsByVehicleUid("veh-001");

    expect(result).toEqual(fakeContracts);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["veh-001"]);
  });

  test("groupContractsByVehicle should return contract count per vehicle", async () => {
    const fakeGroupedData = [
      { vehicle_uid: "veh-001", total_contracts: 2 },
      { vehicle_uid: "veh-002", total_contracts: 1 },
    ];

    db.query.mockResolvedValue([fakeGroupedData]);

    const result = await groupContractsByVehicle();

    expect(result).toEqual(fakeGroupedData);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });
});
