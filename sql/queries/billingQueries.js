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
    [contractId]
  );
  return rows;
}

module.exports = {
  getPaymentByContractId,
};
