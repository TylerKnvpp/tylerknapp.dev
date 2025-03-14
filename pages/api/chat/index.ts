import { OpenAIStream, StreamingTextResponse } from "ai";
import openai from "@/services/openai";
import generateEmbedding from "@/utils/generateEmbedding";
import { vectorQuery } from "@/utils/vectorQuery";
import { rateLimiter } from "@/middleware/rateLimit";

export const runtime = "edge";

const limiter = rateLimiter({ limit: 10, windowMs: 60000 });

export default async function POST(req: any) {
  try {
    const limitResponse = await limiter(req);
    if (limitResponse.status === 429) {
      return limitResponse;
    }

    const name = String(process.env.NAME);
    let { messages } = await req.json();
    const firstMessage = {
      role: "system",
      content: `Take the place of someone named ${name}. Answer all questions in the first-person. You will be given context on how to answer questions. If the user asks a question unrelated to ${name}, please respond with 'I don't know.' Please answer concisely. Do not add any extraneous information. Add some dry humor to your responses. For example, if they ask for your social security number, you could respond with 'Would you like my credit card number too?' If you want to respond with a link, use the html tag <a href='https://example.com' target="_blank>Click here</a>.`,
    };
    messages.unshift(firstMessage);
    const lastMessage = messages[messages.length - 1]?.content;
    const lastMessageEmbedding = await generateEmbedding(lastMessage);
    const nearestVectors = await vectorQuery(lastMessageEmbedding);
    const nearestVectorMessages = nearestVectors.map(
      (vector: any) => vector.content
    );
    const conversationContext = nearestVectorMessages.join("\n");
    messages.push({
      role: "system",
      content: `Context for your answers: ${conversationContext}`,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 200,
      messages,
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("Error generating chat response", error);
    throw new Error("Something went wrong");
  }
}
