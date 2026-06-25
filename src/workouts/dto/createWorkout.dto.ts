import { IsUUID, IsNotEmpty, IsDateString } from "class-validator";

type Exercise = {
    id: string;
    sets?: number;
    reps?: number;
    weights?: number;
}

export class CreateWorkoutDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    exercises: Exercise[];
    
    @IsNotEmpty()
    @IsDateString()
    scheduledAt?: Date;
}