const { getDb } = require("./mongoConnection");
const { v4: uuidv4 } = require("uuid");

/**
 * Get the MongoDB collection "Vehicle"
 */
async function getVehicleCollection() {
  const db = await getDb();
  return db.collection("Vehicle");
}

/**
 * Create a new vehicle
 * @param {Object} data - Vehicle data (without uid)
 * @returns {Object} The inserted vehicle with uid
 */
async function createVehicle(data) {
  const collection = await getVehicleCollection();

  const vehicle = {
    uid: uuidv4(),
    license_plate: data.license_plate,
    informations: data.informations || "",
    km: data.km,
  };

  try {
    await collection.insertOne(vehicle);
    return vehicle;
  } catch (err) {
    throw new Error(`Error creating vehicle: ${err.message}`);
  }
}

/**
 * Get a vehicle by UID
 * @param {string} uid
 * @returns {Object|null} The vehicle or null
 */
async function getVehicleByUid(uid) {
  const collection = await getVehicleCollection();
  try {
    return await collection.findOne({ uid });
  } catch (err) {
    throw new Error(`Error getting vehicle: ${err.message}`);
  }
}

/**
 * Get a vehicle by license plate
 * @param {string} plate
 * @returns {Object|null}
 */
async function getVehicleByPlate(plate) {
  const collection = await getVehicleCollection();
  try {
    return await collection.findOne({ license_plate: plate });
  } catch (err) {
    throw new Error(`Error getting vehicle by plate: ${err.message}`);
  }
}

/**
 * Update a vehicle by UID
 * @param {string} uid
 * @param {Object} updates - Fields to update
 * @returns {boolean} True if updated
 */
async function updateVehicle(uid, updates) {
  const collection = await getVehicleCollection();
  try {
    const { matchedCount } = await collection.updateOne(
      { uid },
      { $set: updates },
    );

    return matchedCount > 0;
  } catch (err) {
    throw new Error(`Error updating vehicle: ${err.message}`);
  }
}

/**
 * Delete a vehicle by UID
 * @param {string} uid
 * @returns {boolean} True if deleted
 */
async function deleteVehicle(uid) {
  const collection = await getVehicleCollection();
  try {
    const { deletedCount } = await collection.deleteOne({ uid });
    return deletedCount > 0;
  } catch (err) {
    throw new Error(`Error deleting vehicle: ${err.message}`);
  }
}

/**
 * Count vehicles by km threshold
 * @param {number} km - The threshold
 * @param {string} operator - 'gt' for more than, 'lt' for less than
 * @returns {number} - The count
 */
async function countVehiclesByKm(km, operator = "gt") {
  const collection = await getVehicleCollection();
  const query = operator === "gt" ? { km: { gt: km } } : { km: { lt: km } };

  try {
    return await collection.countDocuments(query);
  } catch (err) {
    throw new Error(`Error counting vehicles: ${err.message}`);
  }
}

module.exports = {
  createVehicle,
  getVehicleByUid,
  getVehicleByPlate,
  updateVehicle,
  deleteVehicle,
  countVehiclesByKm,
};
