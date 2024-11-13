-- CreateEnum
CREATE TYPE "TypeStorage" AS ENUM ('local', 's3');

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "storage" "TypeStorage" NOT NULL DEFAULT 'local',
    "s3AccessKeyId" TEXT,
    "s3SecretAccessKey" TEXT,
    "S3BucketName" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
