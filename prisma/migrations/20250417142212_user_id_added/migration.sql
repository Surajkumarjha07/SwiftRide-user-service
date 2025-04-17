/*
  Warnings:

  - Made the column `userId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `userId` VARCHAR(191) NOT NULL;
