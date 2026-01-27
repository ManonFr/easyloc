const { deleteContract } = require("./sql/contract");

async function main() {
  await deleteContract(1);
}

main();
