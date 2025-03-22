import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ImageOptimizer } from "./utils/image-optimizer";

@Injectable()
export class UploadsService {
  private readonly s3Client: S3Client;
  private readonly bucketName = this.configService.getOrThrow("S3_BUCKET_NAME");

  constructor(
    private readonly configService: ConfigService,
    private readonly imageOptimizer: ImageOptimizer,
  ) {
    const s3Region = this.configService.getOrThrow("S3_REGION");
    const s3AccessKey = this.configService.getOrThrow("S3_ACCESS_KEY");
    const s3SecretAccessKey = this.configService.getOrThrow("S3_SECRET_ACCESS_KEY");

    if (!s3Region || !s3AccessKey || !s3SecretAccessKey)
      throw new Error("S3 credentials are not set");
    this.s3Client = new S3Client({
      region: s3Region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: s3AccessKey,
        secretAccessKey: s3SecretAccessKey,
      },
    });
  }

  async getFile(key: string) {
    return {
      id: key,
      url: `https://${this.bucketName}.s3.${this.configService.getOrThrow("S3_REGION")}.amazonaws.com/${key}`,
    };
  }

  async uploadFile(file: Express.Multer.File) {
    const key = crypto.randomUUID();

    const { buffer, contentType } = await this.imageOptimizer.optimizeImage(
      file.buffer,
      file.mimetype,
    );

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        originalName: file.originalname,
      },
      // ACL: isPublic ? "public-read" : "private",
    });
    await this.s3Client.send(command);

    return {
      id: key,
      url: (await this.getFile(key)).url,
    };
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);

    return { message: "File deleted succesfully" };
  }
}
