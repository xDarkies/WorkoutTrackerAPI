type Exercise = {
    id: string;
    sets?: number;
    reps?: number;
    weights?: number;
}

export class UpdateWorkoutDto{
    userId: string;
    exercises: Exercise[];
    scheduledAt: Date;
}