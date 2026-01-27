const db = require("../sqlConnection");

/**
 * Get all payments for a specific contract.
 * @param {number} contractId - ID of the contract.
 * @returns {Promise<Array>} - List of billing entries.
 */
async function getPaymentByContractId(contractId) {
  const [rows] = await db.query(
    `SELECT id, contract_id, amount, payment_datetime
        FROM Billing
        WHERE contract_id = ?`,
    [contractId],
  );
  return rows;
}

/**
 * Check if a contract is fully paid.
 * A contract is fully paid if the total amount in Billing is >= Contract.price.
 * @param {number} contractId
 * @returns {Promise<boolean>}
 */
async function isContractFullyPaid(contractId) {
  const [rows] = await db.query(
    `SELECT
       (SELECT IFNULL(SUM(amount), 0) FROM Billing WHERE contract_id = ?) >=
       (SELECT price FROM Contract WHERE id = ?) AS is_paid
     `,
    [contractId, contractId],
  );

  return rows[0]?.is_paid === 1;
}

/**
 * Get all contracts that are not fully paid.
 * A contract is unpaid if the total payments < contract price.
 * @returns {Promise<Array>} - List of unpaid contracts.
 */
async function getUnpaidContracts() {
  const [rows] = await db.query(
    `SELECT c.id, c.customer_uid, c.price, IFNULL(SUM(b.amount), 0) AS total_paid
     FROM Contract c
     LEFT JOIN Billing b ON c.id = b.contract_id
     GROUP BY c.id
     HAVING total_paid < c.price`,
  );

  return rows;
}

module.exports = {
  getPaymentByContractId,
  isContractFullyPaid,
  getUnpaidContracts,
};
