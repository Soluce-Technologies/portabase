/*
  Warnings:

  - Added the required column `dbms` to the `databases` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Dbms" AS ENUM ('postgresql', 'mysql', 'mongodb');

-- AlterTable
ALTER TABLE "databases" ADD COLUMN     "dbms" "Dbms" NOT NULL;
