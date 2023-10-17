import supertest from "supertest";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

// Unit test create contact
describe("POST /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test create contact untuk yang berhasil dengan menampilkan "should can create new contact"
  it("should can create new contact", async () => {
    const result = await supertest(web).post("/api/contacts").set("Authorization", "test").send({
      first_name: "test",
      last_name: "test",
      email: "test@gmail.com",
      phone: "0890900000",
    });

    expect(result.status).toBe(200);
    // karna id auto increment harus defined maka menggunakan "toBeDefined()"
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.phone).toBe("0890900000");
  });

  // unit test create contact untuk yang gagal dengan menampilkan "should reject if request is not valid"
  it("should reject if request is not valid", async () => {
    const result = await supertest(web).post("/api/contacts").set("Authorization", "test").send({
      first_name: "",
      last_name: "test",
      email: "test",
      phone: "0890900000000221313213232132131232112321",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

// Unit test get contact
describe("GET /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test get contact untuk yang berhasil dengan menampilkan "should can create new contact"
  it("should can get contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      // menggunakan id dari getTestContact()
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  // unit test get contact untuk yang gagal dengan menampilkan "should return 404 if contact id is not found"
  it("should return 404 if contact id is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      // menggunakan id dari getTestContact()
      .get("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// Unit test update contact
describe("PUT /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test update contact untuk yang berhasil dengan menampilkan "should can update existing contact"
  it("should can update existing contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "Aji",
        last_name: "Pradana",
        email: "aji@gmail.com",
        phone: "89999999",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("Aji");
    expect(result.body.data.last_name).toBe("Pradana");
    expect(result.body.data.email).toBe("aji@gmail.com");
    expect(result.body.data.phone).toBe("89999999");
  });

  // unit test update contact untuk yang gagal dengan menampilkan "should reject if request is invalid"
  it("should reject if request is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "aji",
        phone: "",
      });

    expect(result.status).toBe(400);
  });

  // unit test update contact untuk yang gagal karena contact tidak ada dengan menampilkan "should reject if contact is not found"
  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test")
      .send({
        first_name: "Aji",
        last_name: "Pradana",
        email: "aji@gmail.com",
        phone: "89999999",
      });

    expect(result.status).toBe(404);
  });
});

// unit test remove contact
describe("DELETE /api/contacts/:contactId", function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test delete contact untuk yang berhasil dengan menampilkan "should can delete contact"
  it("should can delete contact", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    // Mengecek apakah datanya sudah dihapus? kalo sudah berarti datanya harus null
    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  // unit test delete contact untuk yang gagal dengan menampilkan "should reject if contact is not found"
  it("should reject if contact is not found", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

// unit test search contact
describe("GET /api/contacts", function () {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  // unit test search contact tanpa parameter untuk yang berhasil dengan menampilkan "should can search without parameter"
  it("should can search without parameter", async () => {
    const result = await supertest(web).get("/api/contacts").set("Authorization", "test");

    expect(result.status).toBe(200);
    // data yang dicari defaultnya 10
    expect(result.body.data.length).toBe(10);
    // paging defaultnya 1
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  // unit test search contact ke page 2 untuk yang berhasil dengan menampilkan "should can search to page 2"
  it("should can search to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        page: 2,
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    // data yang dicari pada page 2, karna data ada 15 dan page 1 ada 10 maka pada page 2 tersisa 5
    expect(result.body.data.length).toBe(5);
    // paging pada page 2
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  // unit test search contact berdasarkan name untuk yang berhasil dengan menampilkan "should can search using name"
  it("should can search using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "test 1",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  // unit test search contact berdasarkan email untuk yang berhasil dengan menampilkan "should can search using email"
  it("should can search using email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: "test1",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  // unit test search contact berdasarkan phone untuk yang berhasil dengan menampilkan "should can search using phone"
  it("should can search using phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "0809000001",
      })
      .set("Authorization", "test");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
