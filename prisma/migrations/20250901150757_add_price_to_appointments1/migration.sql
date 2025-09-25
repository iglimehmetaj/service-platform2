/*
  Warnings:

  - You are about to alter the column `price` on the `appointment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `appointment` MODIFY `price` DECIMAL(65, 30) NOT NULL;
