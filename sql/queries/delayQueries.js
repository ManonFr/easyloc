const db = require("../sqlConnection");

/**
 * Get all contracts where the vehicle was returned more than 1 hour late.
 * @returns {Promise<Array>} - List of late contracts.
 */
async function getLateContracts() {
  const [rows] = await db.query(
    `SELECT id, vehicle_uid, customer_uid, loc_end_datetime, returning_datetime
     FROM Contract
     WHERE TIMESTAMPDIFF(HOUR, loc_end_datetime, returning_datetime) > 1`,
  );
  return rows;
}

/**
 * Count how many contracts were returned late between two dates.
 * A return is considered late if it's more than 1 hour after loc_end_datetime.
 *
 * @param {string} startDate - Start date (format: 'YYYY-MM-DD')
 * @param {string} endDate - End date (format: 'YYYY-MM-DD')
 * @returns {Promise<number>} - Number of late returns
 */
async function countLateReturnsBetweenDates(startDate, endDate) {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS late_count
       FROM Contract
       WHERE TIMESTAMPDIFF(HOUR, loc_end_datetime, returning_datetime) > 1
       AND sign_datetime BETWEEN ? AND ?;`,
      [startDate, endDate],
    );

    return rows[0].late_count;
  } catch (error) {
    throw new Error(`Failed to count late returns: ${error.message}`);
  }
}

/**
 * Get average delay time (in hours) for each vehicle that had at least one late return.
 * Only consider delays > 1 hour.
 * @returns {Promise<Array>} - Array of {vehicle_uid, avg_delay_hours}
 */
async function getAverageLateTimeByVehicle() {
  try {
    const [rows] = await db.query(
      `SELECT vehicle_uid,
        AVG(TIMESTAMPDIFF(HOUR, loc_end_datetime, returning_datetime)) AS avg_delay_hours
        FROM Contract
        WHERE TIMESTAMPDIFF(HOUR, loc_end_datetime, returning_datetime) > 1
        GROUP BY vehicle_uid`,
    );

    return rows;
  } catch (error) {
    throw new Error(
      `Error retrieving average delay per vehicle: ${error.message}`,
    );
  }
}

module.exports = {
  getLateContracts,
  countLateReturnsBetweenDates,
  getAverageLateTimeByVehicle,
};
