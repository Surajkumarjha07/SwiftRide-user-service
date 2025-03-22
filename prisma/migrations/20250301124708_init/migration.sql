/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `captains` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `captains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `captains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `captains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `captains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `captains` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `captains_email_key` ON `captains`(`email`);
