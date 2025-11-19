const { deleteContract } = require("./sql/contract");

async function main() {
  const deleted = await deleteContract(1);
  console.log(deleted ? "Contract deleted." : "Contract not found.");
}

main();
