/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `Company_subscriptionId_fkey`;

-- DropIndex
DROP INDEX `Company_subscriptionId_fkey` ON `company`;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `subscriptionId`;

-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `description`,
    ADD COLUMN `companyId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
