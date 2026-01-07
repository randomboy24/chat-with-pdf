import { TokenTextSplitter } from "@langchain/textsplitters";
import Document from "../models/Document.model.js";
import { PDFParse } from "pdf-parse";
import Chunk from "../models/Chunk.model.js";
import { generateAndStoreEmbeddings } from "./embeddings.service.js";

export const createDocument = async (data: {
  userId: string;
  fileName: string;
}) => {
  console.log(
    "Creating document for user:",
    data.userId,
    "with filename:",
    data.fileName
  );
  const document = await Document.create({
    fileName: data.fileName,
    userId: data.userId,
  });

  return document;
};

export const createChunks = async (data: {
  userId: string;
  documentId: string;
  fileName: string;
}) => {
  console.log("Creating chunks for document:", data.documentId);
  // get the content out of the pdf
  const parser = new PDFParse({
    url: "uploads/" + data.fileName,
  });

  const pdfData = (await parser.getText()).text;
  console.log(pdfData);

  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 300,
    chunkOverlap: 0,
  });
  const chunks = await splitter.splitText(pdfData);
  for (const [index, chunk] of chunks.entries()) {
    const savedChunk = await Chunk.create({
      userId: data.userId,
      documentId: data.documentId,
      chunkIndex: index,
      content: chunk,
    });

    await generateAndStoreEmbeddings({
      userId: savedChunk.userId,
      chunk: savedChunk.content,
      chunkId: savedChunk._id.toString(),
      documentId: savedChunk.documentId,
      type: "document",
    });
  }

  console.log("Chunks created:", chunks.length);

  // create embeddings for each chunk and store it to the vector db

  // split the content into chunks

  // save each chunk to the database
};
