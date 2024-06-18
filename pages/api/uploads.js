import { connectDB } from "@/lib/connectDB";
import multiparty from "multiparty";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from 'mime-types';
import { isAdminRequest } from "./auth/[...nextauth]";
const bucketName = "nextjs-ecomerce-images-bucket"

export default async function handler(req, res) {

  await isAdminRequest(req, res);

  connectDB()
    .then(async () => {
        const form = new multiparty.Form();
        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
          });
        });
    
        console.log(files);
        console.log("length:", files.file.length);
    
        const client = new S3Client({
          region: "us-east-1",
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          },
        });
    
        let links = [];
    
        for (const file of files.file) {
          const ext = file?.originalFilename.split(".").pop();
          console.log("ext:", ext);
          const fileName = Date.now() + "." + ext; // Corrected to Date.now()
          await client.send(
            new PutObjectCommand({
              Bucket: bucketName,
              ACL: "public-read",
              Key: fileName,
              Body: fs.readFileSync(file.path),
              ContentType: mime.lookup(file.path),
            })
          );
    
          const link = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
          links.push(link);
        }
        console.log(links);
        res.json({links});
    })
    .catch((err) => {
      console.log(err);
    });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
