const db = require("./sqlConnection");

/**
 * Creates the Billing table if it doesn't exist
 */
async function createBillingTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS Billing (
      id INT PRIMARY KEY,
      contract_id INT,
      payment_datetime DATETIME,
      amount DECIMAL(10, 2),
      FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE
    );
  `;

  try {
    await db.query(query);
    return true;
  } catch (error) {
    throw new Error(`Error creating Billing table: ${error.message}`);
  }
}

/**
 * Inserts a new billing record
 * @param {Object} billing - Billing object
 */
async function insertBilling(billing) {
  const query = `
    INSERT INTO Billing (id, contract_id, payment_datetime, amount)
    VALUES (?, ?, ?, ?);
  `;

  const values = [
    billing.id,
    billing.contract_id,
    billing.payment_datetime,
    billing.amount,
  ];

  try {
    await db.query(query, values);
    return true;
  } catch (error) {
    throw new Error(`Error inserting billing: ${error.message}`);
  }
}

/**
 * Retrieves all billing records for a contract
 * @param {number} contractId - Contract ID
 * @returns {Array} List of billing records
 */
async function getBillingsByContract(contractId) {
  const query = `
    SELECT 
      id,
      contract_id,
      payment_datetime,
      amount
    FROM Billing
    WHERE contract_id = ?
  `;

  try {
    const [rows] = await db.query(query, [contractId]);
    return rows;
  } catch (error) {
    throw new Error(`Error retrieving billings: ${error.message}`);
  }
}

/**
 * Updates a billing record by ID
 * @param {Object} billing - Billing object with updated data (must include `id`)
 * @returns {boolean} True if update was successful
 */
async function updateBilling(billing) {
  const query = `
    UPDATE Billing
    SET contract_id = ?, payment_datetime = ?, amount = ?
    WHERE id = ?
  `;

  const values = [
    billing.contract_id,
    billing.payment_datetime,
    billing.amount,
    billing.id,
  ];

  try {
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating billing: ${error.message}`);
  }
}

/**
 * Deletes a billing record by ID
 * @param {number} id - Billing ID
 * @returns {boolean} True if deleted
 */
async function deleteBilling(id) {
  const query = `
    DELETE FROM Billing WHERE id = ?
  `;

  try {
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting billing: ${error.message}`);
  }
}

module.exports = {
  createBillingTable,
  insertBilling,
  getBillingsByContract,
  updateBilling,
  deleteBilling,
};
