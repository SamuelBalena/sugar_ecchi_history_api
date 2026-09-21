import request from "supertest";
import { app } from "../src/app.js";

describe("API HTTP", () => {
  it("responde ao health check", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
  it("expõe o contrato OpenAPI", async () => {
    const response = await request(app).get("/api-docs.json");
    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths["/auth/login"]).toBeDefined();
  });
  it("autentica o admin e retorna um JWT", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({ password: "test-password" });
    expect(response.status).toBe(200);
    expect(response.body.tokenType).toBe("Bearer");
    expect(response.body.token).toEqual(expect.any(String));
  });
  it("rejeita credenciais e admin sem token", async () => {
    await request(app).post("/api/v1/auth/login").send({ password: "invalid" }).expect(401);
    await request(app).get("/api/v1/admin/packs").expect(401);
  });
});
