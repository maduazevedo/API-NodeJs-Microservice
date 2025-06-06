import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

const bucketName = process.env.BUCKET_NAME!;
console.log(bucketName)

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function createBucket() {
  await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
  console.log("Bucket criado com sucesso");
}


export async function uploadImage (file: Express.Multer.File) {
  const uploadParams = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContenType: file.mimetype,

  };

  await s3.send(new PutObjectCommand(uploadParams));
  return `${process.env.S3_ENDPOINT}/${bucketName}/${file.originalname}`;
  
}

export async function uploadLocalImage(url: string) {

  const filePath = path.resolve(url); 

  const fileBuffer = fs.readFileSync(filePath);

  const fileName = path.basename(filePath);

  const contentType = "image/png"; 

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME!, 
    Key: fileName,
    Body: fileBuffer, 
    ContentType: contentType, 
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `${process.env.S3_ENDPOINT}/${process.env.BUCKET_NAME}/${fileName}`;
}