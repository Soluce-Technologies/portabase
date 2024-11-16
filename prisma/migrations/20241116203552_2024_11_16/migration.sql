/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Settings_name_key" ON "Settings"("name");
