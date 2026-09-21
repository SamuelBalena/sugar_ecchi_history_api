import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./store.js";
const port = Number(process.env.PORT ?? 3000);
connectDatabase().then(() => app.listen(port, () => console.log(`Sugar Ecchi API listening on http://localhost:${port}`))).catch((error: Error) => { console.error("Unable to connect to MongoDB:", error.message); process.exit(1); });
