/*
  Warnings:

  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Backup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Database` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restauration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Backup" DROP CONSTRAINT "Backup_database_id_fkey";

-- DropForeignKey
ALTER TABLE "Database" DROP CONSTRAINT "Database_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "Restauration" DROP CONSTRAINT "Restauration_backup_id_fkey";

-- DropForeignKey
ALTER TABLE "Restauration" DROP CONSTRAINT "Restauration_database_id_fkey";

-- DropTable
DROP TABLE "Agent";

-- DropTable
DROP TABLE "Backup";

-- DropTable
DROP TABLE "Database";

-- DropTable
DROP TABLE "Restauration";

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "last_contact" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "databases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "backup_policy" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" TEXT NOT NULL,

    CONSTRAINT "databases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backups" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'waiting',
    "file" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "database_id" TEXT NOT NULL,

    CONSTRAINT "backups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurations" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backup_id" TEXT NOT NULL,
    "database_id" TEXT,

    CONSTRAINT "restaurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "storage" "TypeStorage" NOT NULL DEFAULT 'local',
    "name" TEXT NOT NULL,
    "s3EndPointUrl" TEXT,
    "s3AccessKeyId" TEXT,
    "s3SecretAccessKey" TEXT,
    "S3BucketName" TEXT,
    "smtpPassword" TEXT,
    "smtpFrom" TEXT,
    "smtpHost" TEXT,
    "smtpPort" TEXT,
    "smtpUser" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_slug_key" ON "agents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "settings_name_key" ON "settings"("name");

-- AddForeignKey
ALTER TABLE "databases" ADD CONSTRAINT "databases_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backups" ADD CONSTRAINT "backups_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "databases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurations" ADD CONSTRAINT "restaurations_backup_id_fkey" FOREIGN KEY ("backup_id") REFERENCES "backups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurations" ADD CONSTRAINT "restaurations_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "databases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
