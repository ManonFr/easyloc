const { getSqlConnection } = require("./sqlConnection");

/**
 * Creates the Billing table if it doesn't exist
 */
async function createBillingTable() {
  const connection = await getSqlConnection();

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
    await connection.execute(query);
    return true;
  } catch (error) {
    throw new Error(`Error creating Billing table: ${error.message}`);
  } finally {
    await connection.end();
  }
}

/**
 * Inserts a new billing record
 * @param {Object} billing - Billing object
 */
async function insertBilling(billing) {
  const connection = await getSqlConnection();

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
    await connection.execute(query, values);
    return true;
  } catch (error) {
    throw new Error(`Error inserting billing: ${error.message}`);
  } finally {
    await connection.end();
  }
}

/**
 * Retrieves all billing records for a contract
 * @param {number} contractId - Contract ID
 * @returns {Array} List of billing records
 */
async function getBillingsByContract(contractId) {
  const connection = await getSqlConnection();

  const query = `
    SELECT * FROM Billing WHERE contract_id = ?
  `;

  try {
    const [rows] = await connection.execute(query, [contractId]);
    return rows;
  } catch (error) {
    throw new Error(`Error retrieving billings: ${error.message}`);
  } finally {
    await connection.end();
  }
}

/**
 * Deletes a billing record by ID
 * @param {number} id - Billing ID
 * @returns {boolean} True if deleted
 */
async function deleteBilling(id) {
  const connection = await getSqlConnection();

  const query = `
    DELETE FROM Billing WHERE id = ?
  `;

  try {
    const [result] = await connection.execute(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting billing: ${error.message}`);
  } finally {
    await connection.end();
  }
}

module.exports = {
  createBillingTable,
  insertBilling,
  getBillingsByContract,
  deleteBilling,
};
