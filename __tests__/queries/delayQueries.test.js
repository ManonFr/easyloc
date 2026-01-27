// Use the mocked DB connection
jest.mock("../../sql/sqlConnection");

const db = require("../../sql/sqlConnection");
const {
  getLateContracts,
  countLateReturnsBetweenDates,
  getAverageLateTimeByVehicle,
} = require("../../sql/queries/delayQueries");

describe("Delay queries (with mocked DB)", () => {
  beforeEach(() => {
    db.query.mockReset(); // Reset mock before each test
  });

  test("getLateContracts should return a list of late contracts", async () => {
    const fakeLateContracts = [
      {
        id: 1,
        vehicle_uid: "veh-123",
        customer_uid: "cust-456",
        loc_end_datetime: "2025-01-10 10:00:00",
        returning_datetime: "2025-01-10 13:30:00",
      },
      {
        id: 2,
        vehicle_uid: "veh-789",
        customer_uid: "cust-999",
        loc_end_datetime: "2025-02-01 15:00:00",
        returning_datetime: "2025-02-01 18:15:00",
      },
    ];

    db.query.mockResolvedValue([fakeLateContracts]);

    const result = await getLateContracts();

    expect(result).toEqual(fakeLateContracts);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });

  test("countLateReturnsBetweenDates should return the number of late returns", async () => {
    db.query.mockResolvedValue([[{ late_count: 3 }]]);

    const result = await countLateReturnsBetweenDates(
      "2025-01-01",
      "2025-12-31",
    );

    expect(result).toBe(3);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "2025-01-01",
      "2025-12-31",
    ]);
  });

  test("getAverageLateTimeByVehicle should return average delay per vehicle", async () => {
    const fakeDelays = [
      { vehicle_uid: "veh-123", avg_delay_hours: 2.5 },
      { vehicle_uid: "veh-456", avg_delay_hours: 4.0 },
    ];

    db.query.mockResolvedValue([fakeDelays]);

    const result = await getAverageLateTimeByVehicle();

    expect(result).toEqual(fakeDelays);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });
});
