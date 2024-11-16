-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "smtpFrom" TEXT,
ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPassword" TEXT,
ADD COLUMN     "smtpPort" TEXT,
ADD COLUMN     "smtpUser" TEXT;
