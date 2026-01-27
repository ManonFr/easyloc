const db = require("./sqlConnection");
/**
 * Create the Contract table if it does not exist
 */
async function createContractTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS Contract (
      id INT PRIMARY KEY,
      vehicle_uid CHAR(255),
      customer_uid CHAR(255),
      sign_datetime DATETIME,
      loc_begin_datetime DATETIME,
      loc_end_datetime DATETIME,
      returning_datetime DATETIME,
      price DECIMAL(10, 2)
    );
  `;

  try {
    await db.query(query);
  } catch (error) {
    throw new Error(`Failed to create Contract table: ${error.message}`);
  }
}

/**
 * Retrieves a contract by its unique identifier (primary key).
 * @param {number} id - The ID of the contract to retrieve
 * @returns {Object|null} The contract object if found, or null if not found
 */
async function getContractById(id) {
  const query = `
    SELECT id, vehicle_uid, customer_uid, sign_datetime, loc_begin_datetime,
           loc_end_datetime, returning_datetime, price
    FROM Contract
    WHERE id = ?
  `;
  try {
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error(`Failed to retrieve contract: ${error.message}`);
  }
}

/**
 * Inserts a new contract into the Contract table
 * @param {Object} contract - The contract data to insert
 */
async function insertContract(contract) {
  const query = `
    INSERT INTO Contract 
    (id, vehicle_uid, customer_uid, sign_datetime, loc_begin_datetime, loc_end_datetime, returning_datetime, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [
    contract.id,
    contract.vehicle_uid,
    contract.customer_uid,
    contract.sign_datetime,
    contract.loc_begin_datetime,
    contract.loc_end_datetime,
    contract.returning_datetime,
    contract.price,
  ];

  try {
    await db.query(query, values);
    return { id: contract.id, ...contract };
  } catch (error) {
    throw new Error(`Failed to insert contract: ${error.message}`);
  }
}

/**
 * Updates an existing contract in the Contract table
 * @param {Object} contract - The updated contract data (must include `id`)
 */
async function updateContract(contract) {
  const query = `
    UPDATE Contract
    SET 
      vehicle_uid = ?,
      customer_uid = ?,
      sign_datetime = ?,
      loc_begin_datetime = ?,
      loc_end_datetime = ?,
      returning_datetime = ?,
      price = ?
    WHERE id = ?
  `;

  const values = [
    contract.vehicle_uid,
    contract.customer_uid,
    contract.sign_datetime,
    contract.loc_begin_datetime,
    contract.loc_end_datetime,
    contract.returning_datetime,
    contract.price,
    contract.id, // WHERE condition
  ];

  try {
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      throw new Error(`No contract found with id ${contract.id}`);
    }
  } catch (error) {
    throw new Error(`Failed to update contract: ${error.message}`);
  }
}

/**
 * Deletes a contract by its ID
 * @param {number} id - The ID of the contract to delete
 */
async function deleteContract(id) {
  const query = `DELETE FROM Contract WHERE id = ?`;

  try {
    const [result] = await db.query(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error(`No contract found with id ${id}`);
    }
  } catch (error) {
    throw new Error(`Failed to delete contract: ${error.message}`);
  }
}

module.exports = {
  createContractTable,
  getContractById,
  insertContract,
  updateContract,
  deleteContract,
};
