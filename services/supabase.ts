import { createClient } from "@supabase/supabase-js";
// uncomment for script
// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const supabase = createClient(
  String(process.env.SUPABASE_URL),
  String(process.env.SUPABASE_API_KEY)
);
export default supabase;
