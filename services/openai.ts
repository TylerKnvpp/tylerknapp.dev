import OpenAI from "openai";
// uncomment for script
// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const openai = new OpenAI({
  apiKey: String(process.env.OPENAI_API_KEY),
});
export default openai;
