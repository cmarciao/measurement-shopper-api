/*
  Warnings:

  - Added the required column `customer_code` to the `measures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "measures" ADD COLUMN     "customer_code" TEXT NOT NULL;
