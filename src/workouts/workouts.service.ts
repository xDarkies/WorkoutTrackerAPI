import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { WorkoutStatus } from '@prisma/client';

@Injectable()
export class WorkoutsService {
    constructor(private prisma: PrismaService){}

    async create(reqUserId: string,createWorkoutDto: CreateWorkoutDto){
        const {userId, exercises, scheduledAt} = createWorkoutDto; 

        if(reqUserId !== userId)
            throw new ForbiddenException()

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


    async update(reqUserId: string,updateWorkoutDto: UpdateWorkoutDto,id: string){
        const {userId, exercises, scheduledAt} = updateWorkoutDto; 

        if(reqUserId !== userId)
            throw new ForbiddenException()

        const workout = await this.prisma.workout.findUnique({
            where: {id: id},
        })
        if(!workout)
            throw new NotFoundException()
        
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

    async delete(reqUserId: string, id: string){
        const workout = await this.prisma.workout.findUnique({where: {id}})
        
        if(!workout)
            throw new NotFoundException()

        if(workout.userId !== reqUserId)
            throw new ForbiddenException()

        await this.prisma.workout.delete({where: {id}})

    }

    async updateSchedule(reqUserId: string,updateScheduleDto: UpdateScheduleDto, id: string){
        const workout = await this.prisma.workout.findUnique({where: {id}})

        if(!workout)
            throw new NotFoundException()

        if(workout.userId !== reqUserId)
            throw new ForbiddenException()

        const updated = await this.prisma.workout.update({
            where: {id},
            data: {
                scheduledAt: updateScheduleDto.date
            }
        })

        return updated;
    }

    async markAs(reqUserId: string, status: WorkoutStatus, id: string){
        const workout = await this.prisma.workout.findUnique({where: {id}})

        if(!workout)
            throw new NotFoundException()

        if(workout.userId !== reqUserId)
            throw new ForbiddenException()

        const marked = await this.prisma.workout.update({
            where: {id},
            data: {
                status
            }
        })

        return marked;
    }
}
