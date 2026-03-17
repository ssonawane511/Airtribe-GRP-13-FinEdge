import fs from "fs";
import path from "path";
import openapiSpecification from "./src/config/swagger.js";

const docsDir = path.resolve("docs");
const outputPath = path.join(docsDir, "openapi.json");

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(openapiSpecification, null, 2));
console.log(`Swagger spec generated at ${outputPath}`);
