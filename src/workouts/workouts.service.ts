import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './createWorkout.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkoutsService {
    constructor(private prisma: PrismaService){}

    async create(createWorkoutDto: CreateWorkoutDto){
        const {userId, exercises, scheduledAt} = createWorkoutDto; 

        const workout = await this.prisma.workout.create({
            data: {
                user: { connect: { id: userId } },
                ...(scheduledAt ? { scheduledAt } : {}),
                workoutExercises: {
                    create: exercises.map((ex) => ({
                        exercise: { connect: { id: ex.id } },
                        sets: ex.sets ?? 1,
                        reps: ex.reps ?? 8,
                        weights: ex.weights ?? 0,
                    })),
                },
            },
            include: { workoutExercises: { include: { exercise: true } } },
        });

        return workout;
    }

}
