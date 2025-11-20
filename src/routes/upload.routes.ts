import { Router } from "express";
import multer from "multer";
import fileUploadQueue from "../queues/fileUpload.queue.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req: any, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

// fileUploadWorker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} failed with error: ${err.message}`);
// });
// fileUploadWorker.on("completed", (job) => {
//   console.log(`Job ${job.id} completed successfully.`);
// });

const upload = multer({ storage: storage });

const router = Router();

router.post("/", upload.single("file"), (req: any, res) => {
  const fileName = req.fileName;
  const { userId } = req.body;
  console.log(userId);

  fileUploadQueue.add(
    "fileUpload",
    { fileName: fileName, userId: userId },
    {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res
    .status(200)
    .json({ message: "File uploaded successfully", file: req.file });
});

export default router;
