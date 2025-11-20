import app from "./app.js";
import { connectDB } from "./config/db.js";
import fileUploadQueue from "./queues/fileUpload.queue.js";

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
