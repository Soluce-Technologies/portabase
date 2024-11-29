-- AlterTable
ALTER TABLE "databases" ALTER COLUMN "backupToRestore" DROP NOT NULL,
ALTER COLUMN "isWaitingForBackup" DROP NOT NULL;
