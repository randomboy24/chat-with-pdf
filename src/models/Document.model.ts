import { model, Schema } from "mongoose";

export interface IDocument {
  fileName: string;
  userId: string;
}

const DocumentSchema = new Schema<IDocument>(
  {
    fileName: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Document = model("Document", DocumentSchema);

export default Document;
