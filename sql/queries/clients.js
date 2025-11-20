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

module.exports = {
  getContractsByCustomerUid,
};
