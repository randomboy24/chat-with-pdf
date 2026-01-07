import { Queue } from "bullmq";

const fileUploadQueue = new Queue("fileUpload", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export default fileUploadQueue;
