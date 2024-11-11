import * as Minio from 'minio'
import {env} from "@/env.mjs";
import internal from "node:stream";


// Create a new Minio client with the S3 endpoint, access key, and secret key
export const s3Client = env.NODE_ENV === "production" ?
    new Minio.Client({
        endPoint: env.S3_ENDPOINT ?? "",
        accessKey: env.S3_ACCESS_KEY ?? "",
        secretKey: env.S3_SECRET_KEY ?? "",
    }) : new Minio.Client({
        endPoint: env.S3_ENDPOINT ?? "",
        port: Number(env.S3_PORT ?? 0),
        accessKey: env.S3_ACCESS_KEY ?? "",
        secretKey: env.S3_SECRET_KEY ?? "",
        useSSL: env.S3_USE_SSL === 'true'
    })

export async function checkMinioAlive() {
    try {
        // Try to list buckets to check connectivity
        const buckets = await s3Client.listBuckets();
        console.log('MinIO is up and running. Buckets:', buckets);
    } catch (error) {
        console.error('Error connecting to MinIO:', error);
    }
}

export async function createBucketIfNotExists(bucketName: string) {
    const bucketExists = await s3Client.bucketExists(bucketName)
    if (!bucketExists) {
        console.log(`Creating bucket ${bucketName}`);
        await s3Client.makeBucket(bucketName)
    }
}

/**
 * Save file in S3 bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @param file file to save
 */
export async function saveFileInBucket({
                                           bucketName,
                                           fileName,
                                           file,
                                       }: {
    bucketName: string
    fileName: string
    file: Buffer | internal.Readable
}) {
    // Check if Minio is Alive
    await checkMinioAlive()
    // Create bucket if it doesn't exist
    await createBucketIfNotExists(bucketName)
    // check if file exists - optional.
    // Without this check, the file will be overwritten if it exists
    const fileExists = await checkFileExistsInBucket({
        bucketName,
        fileName,
    })

    console.log('File exists:', fileExists);

    if (fileExists) {
        throw new Error('File already exists')
    }

    // Upload image to S3 bucket
    const result = await s3Client.putObject(bucketName, fileName, file)
    return result
}

/**
 * Check if file exists in bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @returns true if file exists, false if not
 */
export async function checkFileExistsInBucket({bucketName, fileName}: { bucketName: string; fileName: string }) {
    try {
        await s3Client.statObject(bucketName, fileName)
    } catch (error) {
        return false
    }
    return true
}

/**
 * Generate presigned urls for uploading files to S3
 * @param files files to upload
 * @returns promise with array of presigned urls
 */
export async function createPresignedUrlToUpload({
                                                     bucketName,
                                                     fileName,
                                                     expiry = 60 * 60, // 1 hour
                                                 }: {
    bucketName: string
    fileName: string
    expiry?: number
}) {
    // Create bucket if it doesn't exist
    await createBucketIfNotExists(bucketName)

    return await s3Client.presignedPutObject(bucketName, fileName, expiry)
}


// Function to create a bucket and make it public
export async function createPublicBucket({bucketName}: { bucketName: string }) {
    try {
        // Check if the bucket already exists
        const exists = await s3Client.bucketExists(bucketName);
        if (!exists) {
            // Create the bucket
            await s3Client.makeBucket(bucketName); // Change region if needed
            console.log(`Bucket ${bucketName} created successfully.`);
        } else {
            console.log(`Bucket ${bucketName} already exists.`);
        }

        // Define a bucket policy for public access
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: "*",
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }
            ]
        };

        // Set the policy to the bucket
        await s3Client.setBucketPolicy(bucketName, JSON.stringify(policy));
        console.log(`Bucket ${bucketName} is now public.`);
    } catch (error) {
        console.error('Error creating bucket:', error);
    }
}