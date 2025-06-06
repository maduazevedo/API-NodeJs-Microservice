/*
  Warnings:

  - Added the required column `avatar` to the `Activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "type" INTEGER NOT NULL;
