/*
  Warnings:

  - Made the column `name` on table `Avatar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Avatar" ALTER COLUMN "name" SET NOT NULL;
