require("dotenv").config();

const {
  createVehicle,
  getVehicleByUid,
  getVehicleByPlate,
  updateVehicle,
  deleteVehicle,
  countVehiclesByKm,
} = require("../../mongo/vehicle");

const { client } = require("../../mongo/mongoConnection");

describe("MongoDB vehicle module", () => {
  let testUid = null;
  const testPlate = "TEST-PLATE-123";

  test("createVehicle should insert a new vehicle and return a UID", async () => {
    const vehicle = await createVehicle({
      license_plate: testPlate,
      informations: "Test vehicle",
      km: 12000,
    });

    expect(vehicle).toHaveProperty("uid");
    expect(vehicle.license_plate).toBe(testPlate);
    testUid = vehicle.uid;
  });

  test("getVehicleByUid should return the correct vehicle", async () => {
    const vehicle = await getVehicleByUid(testUid);

    expect(vehicle).not.toBeNull();
    expect(vehicle.uid).toBe(testUid);
    expect(vehicle.license_plate).toBe(testPlate);
  });

  test("getVehicleByPlate should return the correct vehicle", async () => {
    const vehicle = await getVehicleByPlate(testPlate);

    expect(vehicle).not.toBeNull();
    expect(vehicle.license_plate).toBe(testPlate);
  });

  test("updateVehicle should update the 'km' field", async () => {
    const updatedKm = 13000;
    const success = await updateVehicle(testUid, { km: updatedKm });

    expect(success).toBe(true);

    const updatedVehicle = await getVehicleByUid(testUid);
    expect(updatedVehicle.km).toBe(updatedKm);
  });

  test("deleteVehicle should remove the vehicle from the database", async () => {
    const success = await deleteVehicle(testUid);
    expect(success).toBe(true);

    const deletedVehicle = await getVehicleByUid(testUid);
    expect(deletedVehicle).toBeNull();
  });

  test("countVehiclesByKm should vehicles above a threshold", async () => {
    const count = await countVehiclesByKm(10000, "gt");

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  afterAll(async () => {
    await client.close();
  });
});
