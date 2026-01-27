const db = require("../sqlConnection");

/**
 * Get all contracts associated with a given vehicle UID.
 * @param {string} vehicleUid - UID of the vehicle
 * @returns {Promise<Array>} - List of contracts
 */
async function getContractsByVehicleUid(vehicleUid) {
  try {
    const [rows] = await db.query(
      `SELECT id, customer_uid, sign_datetime, loc_begin_datetime, loc_end_datetime, returning_datetime, price
            FROM Contract
            WHERE vehicle_uid = ?`,
      [vehicleUid],
    );
    return rows;
  } catch (error) {
    throw new Error(
      `Error retrieving contracts for vehicle ${vehicleUid}: ${error.message}`,
    );
  }
}

/**
 * Get the nomber of contracts per vehicle.
 * @returns {Promise<Array>} - Array of {vehicle_uid, total_contracts}
 */
async function groupContractsByVehicle() {
  try {
    const [rows] = await db.query(
      `SELECT vehicle_uid,
            COUNT(*) AS total_contracts
            FROM Contract
            GROUP BY vehicle_uid`,
    );
    return rows;
  } catch (error) {
    throw new Error(`Error grouping contracts by vehicle: ${error.message}`);
  }
}

module.exports = { getContractsByVehicleUid, groupContractsByVehicle };
