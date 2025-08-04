/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `atividades` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `category` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `userAtActivity` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `activityImage` DROP FOREIGN KEY `activityImage_activityId_fkey`;

-- DropIndex
DROP INDEX `activityImage_activityId_fkey` ON `activityImage`;

-- AlterTable
ALTER TABLE `atividades` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `userAtActivity` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `updatedAt` TIMESTAMP NULL;

-- AddForeignKey
ALTER TABLE `activityImage` ADD CONSTRAINT `activityImage_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `atividades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
