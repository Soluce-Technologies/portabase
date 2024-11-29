/*
  Warnings:

  - Added the required column `backupToRestore` to the `databases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "databases" ADD COLUMN     "backupToRestore" TEXT NOT NULL,
ADD COLUMN     "isWaitingForBackup" BOOLEAN NOT NULL DEFAULT false;
