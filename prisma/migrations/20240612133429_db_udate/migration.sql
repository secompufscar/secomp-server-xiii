/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `atividades` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `category` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `atividades` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `updatedAt` TIMESTAMP NOT NULL;
