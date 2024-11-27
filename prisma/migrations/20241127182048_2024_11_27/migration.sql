/*
  Warnings:

  - Added the required column `generatedId` to the `databases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "databases" ADD COLUMN     "generatedId" TEXT NOT NULL;
