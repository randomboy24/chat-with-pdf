import { model, Schema } from "mongoose";

interface IChunk {
  userId: string;
  documentId: string;
  chunkIndex: number;
  content: string;
}

const ChunkSchema = new Schema<IChunk>({
  userId: { type: String, required: true },
  documentId: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  content: { type: String, required: true },
});

const Chunk = model("Chunk", ChunkSchema);

export default Chunk;
