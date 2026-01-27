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
    [customerUid],
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
    [customerUid],
  );
  return rows;
}

/**
 * Count how many times each customer returned a vehicle late.
 * A return is considered late is it's more than 1 hour after loc_end_datetime.
 * @returns {Promise<Array>} - Array of {customer_uid, late_returns_count}
 */
async function countLateReturnsByCustomer() {
  const [rows] = await db.query(
    `SELECT customer_uid,
            COUNT(*) AS late_returns_count
     FROM Contract
     WHERE TIMESTAMPDIFF(HOUR, loc_end_datetime, returning_datetime) > 1
     GROUP BY customer_uid`,
  );
  return rows;
}

/**
 * Get the number of contracts per customer.
 * @returns {Promise<Array>} - Array of { customer_uid, total_contracts }
 */
async function groupContractsByCustomer() {
  try {
    const [rows] = await db.query(
      `SELECT customer_uid,
              COUNT(*) AS total_contracts
       FROM Contract
       GROUP BY customer_uid`,
    );
    return rows;
  } catch (error) {
    throw new Error(`Error grouping contracts by customer: ${error.message}`);
  }
}

module.exports = {
  getContractsByCustomerUid,
  getOngoingContractsByCustomerUid,
  countLateReturnsByCustomer,
  groupContractsByCustomer,
};
