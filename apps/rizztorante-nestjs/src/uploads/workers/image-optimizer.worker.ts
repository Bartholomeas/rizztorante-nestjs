import { parentPort, workerData } from "worker_threads";

import * as sharp from "sharp";

interface OptimizeImageResult {
  buffer: Buffer;
  contentType: string;
}

const optimizeImage = async (buffer: Buffer, contentType: string): Promise<OptimizeImageResult> => {
  try {
    const optimizedBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    return { buffer: optimizedBuffer, contentType: "image/webp" };
  } catch (err) {
    console.error("Error optimizing image: ", err);
    return { buffer, contentType };
  }
};

if (!parentPort) {
  throw new Error("Worker not found, this module must be run as a worker thread!");
}

const { buffer, contentType } = workerData as { buffer: Buffer; contentType: string };

optimizeImage(buffer, contentType)
  .then((res) => parentPort!.postMessage(res))
  .catch((err: Error) => parentPort!.postMessage({ error: err?.message ?? "Unknown error" }));
