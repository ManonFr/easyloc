const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function getDb() {
  if (!client.db) {
    await client.connect();
  }
  return client.db("easyloc");
}

module.exports = { getDb };
