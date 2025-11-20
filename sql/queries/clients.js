const db = require("../sqlConnection");

/**
 * Get all contracts for a specific customer.
 * @param {string} customerUid - Unique ID of the customer.
 * @returns {Promise<Array>} - Array of contract objects.
 */
async function getContractsByCustomerUid(customerUid) {
  const [rows] = await db.query(
    `SELECT id, vehicle_uid, sign_datetime, loc_begin_datetime, loc_end_datetime, returning_datetime, price
     FROM Contract
     WHERE customer_uid = ?`,
    [customerUid]
  );
  return rows;
}

/**
 * Get all ongoing contracts for a specific customer.
 * A contract is ongoing if it's between loc_begin and loc_end, and not yet returned.
 * @param {string} customerUid
 * @returns {Promise<Array>}
 */
async function getOngoingContractsByCustomerUid(customerUid) {
  const [rows] = await db.query(
    `SELECT id, vehicle_uid, loc_begin_datetime, loc_end_datetime
     FROM Contract
     WHERE customer_uid = ?
     AND NOW() BETWEEN loc_begin_datetime AND loc_end_datetime
     AND (returning_datetime IS NULL OR returning_datetime > NOW())`,
    [customerUid]
  );
  return rows;
}

module.exports = {
  getContractsByCustomerUid,
  getOngoingContractsByCustomerUid,
};
