/*
  Warnings:

  - Added the required column `weights` to the `workout_exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledAt` to the `workouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workout_exercises" ADD COLUMN     "weights" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL;
