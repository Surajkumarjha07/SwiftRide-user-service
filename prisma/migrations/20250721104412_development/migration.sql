-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL DEFAULT 0.00,
    `longitude` DOUBLE NOT NULL DEFAULT 0.00,
    `in_ride` ENUM('IN_RIDE', 'NOT_IN_RIDE') NOT NULL DEFAULT 'NOT_IN_RIDE',

    UNIQUE INDEX `users_userId_key`(`userId`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
