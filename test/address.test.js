import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createManyTestContact, createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContacts, removeTestUser } from "./test-util.js";

// Unit test create address
describe("POST /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test create address untuk yang berhasil dengan menampilkan "should can create new address"
  it("should can create new address", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "indonesia",
        postal_code: "234234",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("jalan test");
    expect(result.body.data.city).toBe("kota test");
    expect(result.body.data.province).toBe("provinsi test");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("234234");
  });

  // unit test create address untuk yang gagal dengan menampilkan "should reject if address request is invalid"
  it("should reject if address request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
  });

  // unit test create address untuk yang gagal karena kontak tidak ada dengan menampilkan "should reject if contact is not found"
  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "jalan test",
        city: "kota test",
        province: "provinsi test",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(404);
  });
});

// Unit test get address
describe("GET /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test get address untuk yang berhasil dengan menampilkan "should can get contact"
  it("should can get contact", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("jalan test");
    expect(result.body.data.city).toBe("kota test");
    expect(result.body.data.province).toBe("provinsi test");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("234234");
  });

  // unit test get address untuk yang gagal karena contact tidak ditemukan dengan menampilkan "should reject is contact if not found"
  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  // unit test get address untuk yang gagal karena address tidak ditemukan dengan menampilkan "should reject if address is not found"
  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Unit test Update address
describe("PUT /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test update address untuk yang berhasil dengan menampilkan "should can update address"
  it("should can update address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "provinsi",
        country: "indonesia",
        postal_code: "1234",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress.id);
    expect(result.body.data.street).toBe("street");
    expect(result.body.data.city).toBe("city");
    expect(result.body.data.province).toBe("provinsi");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("1234");
  });

  // unit test get address untuk yang gagal dengan menampilkan "should reject request is not valid"
  it("should reject if request is not valid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "provinsi",
        country: "",
        postal_code: "",
      });

    expect(result.status).toBe(400);
  });

  // unit test get address untuk yang gagal karena id address tidak ditemukan dengan menampilkan "should reject if address is not found"
  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1))
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "provinsi",
        country: "indonesia",
        postal_code: "123421421",
      });

    expect(result.status).toBe(404);
  });

  // unit test get address untuk yang gagal karena contact tidak ditemukan dengan menampilkan "should reject if contact is not found"
  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id)
      .set("Authorization", "test")
      .send({
        street: "street",
        city: "city",
        province: "provinsi",
        country: "indonesia",
        postal_code: "123421421",
      });

    expect(result.status).toBe(404);
  });
});

// Unit test delete address
describe("DELETE /api/contacts/:contactId/addresses/:addressId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test delete address untuk yang berhasil dengan menampilkan "should can remove address"
  it("should can remove address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  // unit test Delete address untuk yang gagal karna address tidak ditemukan dengan menampilkan "should reject if address is not found"
  it("should reject if address is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  // unit test Delete address untuk yang gagal karna contact tidak ditemukan dengan menampilkan "should reject if contact is not found"
  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Unit test list address
describe("GET /api/contacts/:contactId/addresses", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test list address untuk yang berhasil dengan menampilkan "should can list addresses"
  it("should can list addresses", async function () {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  // unit test list address untuk yang gagal karena contact tidak ditemukan dengan menampilkan "should reject if contact is not found"
  it("should reject if contact is not found", async function () {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1) + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});
