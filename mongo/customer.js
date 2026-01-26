const { getDb } = require("./mongoConnection");
const { v4: uuidv4 } = require("uuid");

/**
 * Get the MongoDB collection "Customer"
 */
async function getCustomerCollection() {
  const db = await getDb();
  return db.collection("Customer");
}

/**
 * Create a new customer
 * @param {Object} data - Customer data (without uid)
 * @returns {Object} The inserted customer with uid
 */
async function createCustomer(data) {
  const collection = await getCustomerCollection();

  const customer = {
    uid: uuidv4(),
    first_name: data.first_name,
    second_name: data.second_name,
    address: data.address,
    permit_number: data.permit_number,
  };

  try {
    await collection.insertOne(customer);
    return customer;
  } catch (err) {
    throw new Error(`Error creating customer: ${err.message}`);
  }
}

/**
 * Get a customer by UID
 * @param {string} uid
 * @returns {Object|null} The customer or null
 */
async function getCustomerByUid(uid) {
  const collection = await getCustomerCollection();

  try {
    return await collection.findOne({ uid });
  } catch (err) {
    throw new Error(`Error fetching customer by uid: ${err.message}`);
  }
}

/**
 * Search customer by first name + second name
 * @param {string} firstName
 * @param {string} secondName
 * @returns {Array} Matching customers
 */
async function getCustomerByName(firstName, secondName) {
  const collection = await getCustomerCollection();

  try {
    return await collection
      .find({ first_name: firstName, second_name: secondName })
      .toArray();
  } catch {
    throw new Error(`Error fetching customer by name: ${err.message}`);
  }
}

/**
 * Update a customer by uid
 * @param {string} uid
 * @param {Object} updates - Fields to update
 * @returns {boolean} true if updated
 */
async function updateCustomer(uid, updates) {
  const collection = await getCustomerCollection();

  try {
    const { matchedCount } = await collection.updateOne(
      { uid },
      { $set: updates },
    );

    return matchedCount > 0;
  } catch (err) {
    throw new Error(`Error updating customer: ${err.message}`);
  }
}

/**
 * Delete a customer by uid
 * @param {string} uid
 * @returns {boolean} true if deleted
 */
async function deleteCustomer(uid) {
  const collection = await getCustomerCollection();

  try {
    const { deletedCount } = await collection.deleteOne({ uid });
    return deletedCount > 0;
  } catch (err) {
    throw new Error(`Error deleting customer: ${err.message}`);
  }
}

module.exports = {
  createCustomer,
  getCustomerByUid,
  getCustomerByName,
  updateCustomer,
  deleteCustomer,
};
