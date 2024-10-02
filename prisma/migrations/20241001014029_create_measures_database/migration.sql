-- CreateEnum
CREATE TYPE "measure_type" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "measure_type" "measure_type" NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_uuid")
);
