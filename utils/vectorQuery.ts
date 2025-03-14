import supabase from "@/services/supabase";
import { logger } from "./logger";

export const vectorQuery = async (embedding: any[]) => {
  try {
    const { data, error } = await supabase.rpc("vector_query", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
    });
    logger("Found similar vectors: ", [{ data, error }]);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error querying vectors");
  }
};
