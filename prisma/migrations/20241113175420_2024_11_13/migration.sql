/*
  Warnings:

  - You are about to drop the column `authMethod` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Restore` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "authMethod",
ADD COLUMN     "auth_method" TEXT;

-- DropTable
DROP TABLE "Restore";

-- CreateTable
CREATE TABLE "Restauration" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'waiting',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backup_id" TEXT NOT NULL,
    "database_id" TEXT,

    CONSTRAINT "Restauration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Backup" ADD CONSTRAINT "Backup_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "Database"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restauration" ADD CONSTRAINT "Restauration_backup_id_fkey" FOREIGN KEY ("backup_id") REFERENCES "Backup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restauration" ADD CONSTRAINT "Restauration_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "Database"("id") ON DELETE CASCADE ON UPDATE CASCADE;
