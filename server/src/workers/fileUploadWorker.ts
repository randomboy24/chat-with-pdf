import { Worker } from "bullmq";
import { rm, rmdir } from "node:fs/promises";
import { createChunks, createDocument } from "../services/document.service.js";
import { connectDB } from "../config/db.js";
await connectDB();
const fileUploadWorker = new Worker(
  "fileUpload",
  async (job) => {
    // Implementation for processing file upload jobs
    console.log("Starting file upload job processing with job id:", job.id);

    const { fileName, userId } = job.data;
    console.log("fileName = ", fileName);

    // save the docs to the db
    try {
      const document = await createDocument({
        userId,
        fileName: fileName,
      });

      console.log("Document created in DB:", document);
      // create chunks and save each chunk to the database

      await createChunks({
        userId,
        documentId: document._id.toString(),
        fileName,
      });

      console.log("chunks created for " + fileName);

      // after saving the chunks to the db simply delete the files
      await rm("uploads/" + job.data.fileName, {
        force: true,
      });
      console.log(`File ${job.data.filename} deleted after processing.`);
    } catch (error) {
      console.error("Error in fileUploadWorker:", error);
    }
    // Add your file upload logic here
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

export default fileUploadWorker;
