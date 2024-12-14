/*
  Warnings:

  - You are about to drop the `restaurations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "restaurations" DROP CONSTRAINT "restaurations_backup_id_fkey";

-- DropForeignKey
ALTER TABLE "restaurations" DROP CONSTRAINT "restaurations_database_id_fkey";

-- DropTable
DROP TABLE "restaurations";

-- CreateTable
CREATE TABLE "restorations" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backup_id" TEXT NOT NULL,
    "database_id" TEXT,

    CONSTRAINT "restorations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restorations" ADD CONSTRAINT "restorations_backup_id_fkey" FOREIGN KEY ("backup_id") REFERENCES "backups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restorations" ADD CONSTRAINT "restorations_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "databases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
