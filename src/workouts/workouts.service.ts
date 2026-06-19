import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';

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


    async update(updateWorkoutDto: UpdateWorkoutDto,id: string){
        const workout = await this.prisma.workout.findUnique({
            where: {id: id},
        })
        if(!workout)
            throw new NotFoundException()

        const {userId, exercises, scheduledAt} = updateWorkoutDto; 
        
        const updated = await this.prisma.workout.update({
            where: { id },
            data: {
                ...(userId ? { user: { connect: { id: userId } } } : {}),
                ...(scheduledAt ? { scheduledAt } : {}),
                workoutExercises: {
                    deleteMany: {},
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

        return updated;
    }
}
