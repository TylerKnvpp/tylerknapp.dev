import supabase from "../services/supabase";
import { logger } from "./logger";

export const saveEmbedding = async (embedding: any[], text: string) => {
  try {
    const { data, error } = await supabase.from("embeddings").insert({
      content: text,
      embedding,
    });
    logger("newEntry", [{ data, error }]);
  } catch (error) {
    console.log(error);
    throw new Error("Error saving embedding");
  }
};
