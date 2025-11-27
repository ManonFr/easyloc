require("dotenv").config();

const {
  createCustomer,
  getCustomerByUid,
  getCustomerByName,
  updateCustomer,
  deleteCustomer,
} = require("../../mongo/customer");
const { client } = require("../../mongo/mongoConnection");

describe("MongoDB customer module", () => {
  let testUid = null;

  test("createCustomer should insert a new customer and return a UID", async () => {
    const customer = await createCustomer({
      first_name: "Test",
      second_name: "McTest",
      address: "99 rue du Test",
      permit_number: "TEST-123",
    });

    expect(customer).toHaveProperty("uid");
    expect(customer.first_name).toBe("Test");
    testUid = customer.uid;
  });

  test("getCustomerByUid should return the correct customer", async () => {
    const customer = await getCustomerByUid(testUid);

    expect(customer).not.toBeNull();
    expect(customer.uid).toBe(testUid);
    expect(customer.first_name).toBe("Test");
    expect(customer.second_name).toBe("McTest");
  });

  test("getCustomerByName should return the correct customer", async () => {
    const customers = await getCustomerByName("Test", "McTest");

    expect(customers.length).toBeGreaterThan(0);
    expect(customers[0].first_name).toBe("Test");
    expect(customers[0].second_name).toBe("McTest");
  });

  test("updateCustomer should modify the first_name field", async () => {
    const success = await updateCustomer(testUid, { first_name: "Updated" });

    expect(success).toBe(true);

    const updated = await getCustomerByUid(testUid);
    expect(updated.first_name).toBe("Updated");
  });

  test("deleteCustomer should remove the user from the database", async () => {
    const success = await deleteCustomer(testUid);
    expect(success).toBe(true);

    const deleted = await getCustomerByUid(testUid);
    expect(deleted).toBeNull();
  });

  afterAll(async () => {
    await client.close();
  });
});
