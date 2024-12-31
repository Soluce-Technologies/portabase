/*
  Warnings:

  - Added the required column `role` to the `users_organisations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('member', 'admin');

-- AlterTable
ALTER TABLE "users_organisations" ADD COLUMN     "role" "OrganizationRole" NOT NULL;
