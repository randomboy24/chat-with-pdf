import { pipeline } from "@huggingface/transformers";
import vectorStore from "../config/vectorStore.js";
import { randomUUID } from "node:crypto";

export const generateAndStoreEmbeddings = async (data: {
  userId?: string;
  chunk?: string;
  chunkId?: string;
  documentId?: string;
  type: "query" | "document";
}) => {
  console.log("Generating embeddings for chunk:", data.chunkId);
  // use huggingface transformers to get the embeddings
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const embeddings = (
    await extractor(data.chunk!, {
      pooling: "mean",
      normalize: true,
    })
  ).data;

  console.log("Embeddings generated:", embeddings);

  if (data.type === "query") {
    return embeddings;
  }

  // store the embeddings in chroma db
  const collection = await vectorStore.getOrCreateCollection({
    name: "test",
    embeddingFunction: null,
  });

  const result = await collection.add({
    ids: [randomUUID()],
    documents: [data.chunk!],
    embeddings: [embeddings as number[]],
  });

  console.log(
    "Embeddings for chunk " + data.chunkId + " stored in vector store:",
    result
  );
  return embeddings;
};
