import { OpenAIStream, StreamingTextResponse } from "ai";
import openai from "@/services/openai";
import generateEmbedding from "@/utils/generateEmbedding";
import { vectorQuery } from "@/utils/vectorQuery";

export const runtime = "edge";

export default async function POST(req: any) {
	let { messages } = await req.json();
	const firstMessage = {
		role: "system",
		content:
			"Take the place of someone named Tyler Knapp. Answer all questions in the first-person. You will be given context on how to answer questions. If the user asks a question unrelated to Tyler Knapp, please respond with 'I don't know.' Please answer concisely. Do not add any extraneous information",
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
		model: "gpt-3.5-turbo",
		stream: true,
		max_tokens: 200,
		messages,
	});
	const stream = OpenAIStream(response);
	return new StreamingTextResponse(stream);
}
