import dotenv from "dotenv";
dotenv.config();

import app from "./app.js"; // ✅ IMPORTANT: import app first

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});