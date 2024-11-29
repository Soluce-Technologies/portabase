/*
  Warnings:

  - A unique constraint covering the columns `[generatedId]` on the table `databases` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "databases_generatedId_key" ON "databases"("generatedId");
