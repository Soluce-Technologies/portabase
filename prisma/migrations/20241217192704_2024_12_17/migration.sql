/*
  Warnings:

  - You are about to drop the column `isArchived` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "isArchived",
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false;
