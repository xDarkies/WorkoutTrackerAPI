-- CreateEnum
CREATE TYPE "WorkoutStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "status" "WorkoutStatus" NOT NULL DEFAULT 'SCHEDULED';
