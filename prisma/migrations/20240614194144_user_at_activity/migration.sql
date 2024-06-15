/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `atividades` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `category` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `event_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_event_id_fkey`;

-- AlterTable
ALTER TABLE `atividades` ADD COLUMN `detalhes` VARCHAR(191) NULL,
    ADD COLUMN `vagas` INTEGER NULL,
    MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `event_id`,
    ADD COLUMN `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `presente` BOOLEAN NULL,
    ADD COLUMN `updatedAt` TIMESTAMP NULL;

-- DropTable
DROP TABLE `events`;

-- CreateTable
CREATE TABLE `userAtActivity` (
    `id` VARCHAR(191) NOT NULL,
    `presente` BOOLEAN NOT NULL,
    `inscricaoPrevia` BOOLEAN NOT NULL,
    `listaEspera` BOOLEAN NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `activityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userAtActivity` ADD CONSTRAINT `userAtActivity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userAtActivity` ADD CONSTRAINT `userAtActivity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `atividades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
