import { ChromaClient } from "chromadb";

const vectorStore = new ChromaClient({
  host: "localhost",
  port: 8000,
});

export default vectorStore;
