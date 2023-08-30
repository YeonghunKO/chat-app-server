/*
  Warnings:

  - You are about to drop the column `userEmail` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userEmail_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userEmail_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userEmail",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_value_key" ON "RefreshToken"("value");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
