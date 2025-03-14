import generateEmbedding from "../utils/generateEmbedding";
import { saveEmbedding } from "../utils/saveEmbedding";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

async function generateEmbeddings() {
  try {
    const filePath = path.join(process.cwd(), "../documents/resume/index.txt");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lines = fileContent.split("\n");

    if (!lines) {
      return console.log("Error reading file");
    }

    console.log(`Processing ${lines.length} lines...`);

    for (const line of lines) {
      if (line.trim() === "") continue;

      const embedding = await generateEmbedding(line);
      await saveEmbedding(embedding, line);
      console.log(`Processed: ${line.substring(0, 40)}...`);
    }

    console.log("Embeddings generated and saved successfully");
  } catch (error) {
    console.error("Error generating and saving embeddings:", error);
    process.exit(1);
  }
}
// Execute the function
generateEmbeddings();
