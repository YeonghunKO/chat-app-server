/*
  Warnings:

  - You are about to drop the column `name` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RefreshToken_name_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "name";
