// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	name: string;
};

import fs from "fs";
import path from "path";
import generateEmbedding from "@/utils/generateEmbedding";
import { saveEmbedding } from "@/utils/saveEmbedding";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	try {
		const filePath = path.join(process.cwd(), "documents/Resume/general.txt");
		const fileContent = fs.readFileSync(filePath, "utf8");
		const lines = fileContent.split("\n");

		if (!lines) {
			return console.log("Error reading file");
		}

		for (const line of lines) {
			const embedding = await generateEmbedding(line);
			await saveEmbedding(embedding, line);
		}

		res
			.status(200)
			.json({ name: "Embeddings generated and saved successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			name: "Error generating and saving embeddings",
		});
	}
}
