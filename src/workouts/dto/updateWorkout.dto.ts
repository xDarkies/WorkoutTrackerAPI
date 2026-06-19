import { IsDate } from "class-validator";

type Exercise = {
    id: string;
    sets?: number;
    reps?: number;
    weights?: number;
}

export class UpdateWorkoutDto{
    exercises: Exercise[];
    
    @IsDate()
    scheduledAt: Date;
}