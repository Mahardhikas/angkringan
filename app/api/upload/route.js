import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from 'uniqid';

export async function POST(req) {
  try {
    const data = await req.formData();
    if (data.get('file')) {
      const file = data.get('file');

      const accessKeyId = process.env.AWS_ACCESS_KEY;
      const secretAccessKey = process.env.AWS_SECRET_KEY;

      // Log credentials to ensure they are being resolved correctly
      console.log('Access Key ID:', accessKeyId);
      console.log('Secret Access Key:', secretAccessKey);

      const s3Client = new S3Client({
        region: 'ap-southeast-2',
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const ext = file.name.split('.').slice(-1)[0];
      const newFileName = uniqid() + '.' + ext;

      const chunks = [];
      for await (const chunk of file.stream()) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      const bucket = 'angkringan-umi';
      await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: newFileName,
        ACL: 'public-read',
        ContentType: file.type,
        Body: buffer,
      }));

      const link = 'https://' + bucket + '.s3.amazonaws.com/' + newFileName;
      return new Response(JSON.stringify(link), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
