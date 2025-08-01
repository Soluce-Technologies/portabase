import * as Minio from "minio";
import {env} from "@/env.mjs";
import internal from "node:stream";
import {db} from "@/db";
import * as drizzleDb from "@/db";
import {eq} from "drizzle-orm";


async function getS3Client() {
    const settings = await db
        .select()
        .from(drizzleDb.schemas.setting)
        .where(eq(drizzleDb.schemas.setting.name, "system"))
        .then((res) => res[0]);

    if (!settings) {
        throw new Error("S3 settings not found in database.");
    }

    const baseConfig = {
        endPoint: settings.s3EndPointUrl ?? "",
        accessKey: settings.s3AccessKeyId ?? "",
        secretKey: settings.s3SecretAccessKey ?? "",
    };

    const s3Client =
        env.NODE_ENV === "production"
            ? new Minio.Client({
                ...baseConfig,
            })
            : new Minio.Client({
                ...baseConfig,
                port: Number(env.S3_PORT ?? 0),
                useSSL: env.S3_USE_SSL === "true",
            });

    return s3Client;
}

export async function checkMinioAlive() {
    try {
        console.log("Check MinioAlive");
        const s3Client = await getS3Client();
        // Try to list buckets to check connectivity
        const buckets = await s3Client.listBuckets();
        console.log("MinIO is up and running. Buckets:", buckets);
        return {message: true};
    } catch (error) {
        console.error("Error connecting to MinIO:", error);
        return {error: error};
    }
}

export async function createBucketIfNotExists(bucketName: string) {
    const s3Client = await getS3Client();

    const bucketExists = await s3Client.bucketExists(bucketName);
    if (!bucketExists) {
        console.log(`Creating bucket ${bucketName}`);
        await s3Client.makeBucket(bucketName);
    }
}

/**
 * Save file in S3 bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @param file file to save
 */
export async function saveFileInBucket({bucketName, fileName, file}: {
    bucketName: string;
    fileName: string;
    file: Buffer | internal.Readable
}) {
    // Check if Minio is Alive
    await checkMinioAlive();
    // Create bucket if it doesn't exist
    await createBucketIfNotExists(bucketName);
    // check if file exists - optional.
    // Without this check, the file will be overwritten if it exists
    const fileExists = await checkFileExistsInBucket({
        bucketName,
        fileName,
    });

    console.log("File exists:", fileExists);

    if (fileExists) {
        throw new Error("File already exists");
    }
    const s3Client = await getS3Client();

    // Upload image to S3 bucket
    const result = await s3Client.putObject(bucketName, fileName, file);
    return result;
}

/**
 * Check if file exists in bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @returns true if file exists, false if not
 */
export async function checkFileExistsInBucket({bucketName, fileName}: { bucketName: string; fileName: string }) {
    const s3Client = await getS3Client();

    try {
        await s3Client.statObject(bucketName, fileName);
    } catch (error) {
        return false;
    }
    return true;
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
    bucketName: string;
    fileName: string;
    expiry?: number;
}) {
    // Create bucket if it doesn't exist
    await createBucketIfNotExists(bucketName);
    const s3Client = await getS3Client();

    return await s3Client.presignedPutObject(bucketName, fileName, expiry);
}

// Function to create a bucket and make it public
export async function createPublicBucket({bucketName}: { bucketName: string }) {
    const s3Client = await getS3Client();

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
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${bucketName}/*`,
                },
            ],
        };

        // Set the policy to the bucket
        await s3Client.setBucketPolicy(bucketName, JSON.stringify(policy));
        console.log(`Bucket ${bucketName} is now public.`);
    } catch (error) {
        console.error("Error creating bucket:", error);
    }
}
