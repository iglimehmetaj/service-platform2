/*
  Warnings:

  - You are about to drop the column `closingTime` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `closingTime`,
    DROP COLUMN `openingTime`,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;
