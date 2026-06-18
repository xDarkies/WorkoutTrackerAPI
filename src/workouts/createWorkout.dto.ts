type Exercise = {
    id: string;
    sets?: number;
    reps?: number;
    weights?: number;
}

export class CreateWorkoutDto {
    userId: string;
    exercises: Exercise[];
    scheduledAt?: Date;
}