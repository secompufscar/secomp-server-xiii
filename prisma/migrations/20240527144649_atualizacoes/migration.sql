-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_event_id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `event_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
