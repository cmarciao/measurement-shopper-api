/*
  Warnings:

  - Changed the type of `customer_code` on the `measures` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "measures" DROP COLUMN "customer_code",
ADD COLUMN     "customer_code" INTEGER NOT NULL;
