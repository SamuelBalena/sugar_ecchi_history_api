export const openapi = {
  openapi: "3.0.3",
  info: { title: "Sugar Ecchi History API", version: "1.0.0", description: "API REST do catálogo SugarEcchi." },
  servers: [{ url: "http://localhost:3000/api/v1", description: "Desenvolvimento" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      LocalizedText: { type: "object", required: ["en", "ja"], properties: { en: { type: "string" }, ja: { type: "string" } } },
      Pack: { type: "object", properties: { id: { type: "string" }, slug: { type: "string" }, title: { $ref: "#/components/schemas/LocalizedText" }, price: { type: "number" }, isPublished: { type: "boolean" } } },
      Error: { type: "object", properties: { error: { type: "string" } } }
    }
  },
  paths: {
    "/auth/login": { post: { tags: ["Auth"], summary: "Autentica o administrador", requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["password"], properties: { email: { type: "string", format: "email" }, password: { type: "string" } } } } } }, responses: { "200": { description: "Token JWT" }, "401": { description: "Credenciais inválidas" } } } },
    "/catalog": { get: { tags: ["Catalog"], summary: "Retorna o catálogo", responses: { "200": { description: "Catálogo" } } } },
    "/packs": { get: { tags: ["Catalog"], summary: "Lista packs publicados", parameters: [{ name: "featured", in: "query", schema: { type: "boolean" } }, { name: "bestseller", in: "query", schema: { type: "boolean" } }, { name: "query", in: "query", schema: { type: "string" } }], responses: { "200": { description: "Packs", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Pack" } } } } } } } },
    "/packs/{slug}": { get: { tags: ["Catalog"], summary: "Busca pack por slug", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Pack" }, "404": { description: "Não encontrado" } } } },
    "/wishlist": { get: { tags: ["Wishlist"], summary: "Lista favoritos", parameters: [{ name: "X-Visitor-Id", in: "header", required: true, schema: { type: "string" } }], responses: { "200": { description: "IDs dos packs" } } }, post: { tags: ["Wishlist"], summary: "Adiciona ou remove favorito", parameters: [{ name: "X-Visitor-Id", in: "header", required: true, schema: { type: "string" } }], responses: { "200": { description: "IDs atualizados" } } } },
    "/admin/packs": { get: { tags: ["Admin"], security: [{ bearerAuth: [] }], summary: "Lista todos os packs", responses: { "200": { description: "Packs" }, "401": { description: "Não autorizado" } } }, post: { tags: ["Admin"], security: [{ bearerAuth: [] }], summary: "Cria pack", responses: { "201": { description: "Criado" }, "422": { description: "Dados inválidos" } } } },
    "/admin/packs/{id}": { patch: { tags: ["Admin"], security: [{ bearerAuth: [] }], summary: "Atualiza pack", responses: { "200": { description: "Atualizado" } } }, delete: { tags: ["Admin"], security: [{ bearerAuth: [] }], summary: "Exclui pack", responses: { "204": { description: "Excluído" } } } }
  }
} as const;
