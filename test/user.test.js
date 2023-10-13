import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { removeTestUser, createTestUser, getTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

// Unit test register
describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  // unit test register untuk yang berhasil dengan menampilkan "should can register new user"
  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  // unit test register untuk yang gagal dengan menampilkan "request is invalid"
  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined;
  });

  // unit test register untuk yang gagal dengan menampilkan "username already registered"
  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

// Unit test login

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // unit test login untuk yang berhasil dengan menampilkan "should can login"
  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("test");
  });

  // unit test login untuk yang gagal dengan menampilkan "should reject login if request is invalid"

  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  // unit test login jika password salah dengan menampilkan "should reject login if password is wrong"

  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "salah",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  // unit test login jika username salah dengan menampilkan "should reject login if username is wrong"

  it("should reject login if username is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "salah",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// Unit test get users

describe("GET /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // unit test get user yang berhasil dengan menampilkan "should can get current user"

  it("should can get current user", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
  });

  // unit test get user yang gagal jika tokenya salah dengan menampilkan "should reject if token is invalid"

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current").set("Authorization", "salah");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// Unit test update users

describe("PATCH /api/users/current", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  // unit test update user yang berhasil ketika datanya berhasil diupdate dengan menampilkan "should can update user"

  it("should can update user", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      name: "Aji",
      password: "rahasialagi",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Aji");

    const user = await getTestUser();
    expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
  });

  // unit test update name yang berhasil ketika datanya berhasil diupdate dengan menampilkan "should can update user name"

  it("should can update user name", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      name: "Aji",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("Aji");
  });

  // unit test update password yang berhasil ketika datanya berhasil diupdate dengan menampilkan "should can update user password"

  it("should can update user password", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "test").send({
      password: "rahasialagi",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");

    const user = await getTestUser();
    expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
  });

  // unit test update user yang gagal dengan menampilkan "should reject if request is not valid"

  it("should reject if request is not valid", async () => {
    const result = await supertest(web).patch("/api/users/current").set("Authorization", "salah").send({});

    expect(result.status).toBe(401);
  });
});
