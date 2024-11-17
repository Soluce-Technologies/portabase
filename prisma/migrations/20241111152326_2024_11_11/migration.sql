/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_slug_key" ON "Agent"("slug");

-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
