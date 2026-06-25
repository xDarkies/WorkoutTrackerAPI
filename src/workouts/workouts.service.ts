import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { WorkoutStatus } from '@prisma/client';
import { ListWorkoutsDto } from './dto/listWorkouts.dto';

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
        const {exercises, scheduledAt} = updateWorkoutDto; 

        const workout = await this.prisma.workout.findUnique({
            where: {id: id},
        })
        if(!workout)
            throw new NotFoundException()

        
        if(reqUserId !== workout.userId)
            throw new ForbiddenException()

        
        const updated = await this.prisma.workout.update({
            where: { id },
            data: {
                ...(workout.userId ? { user: { connect: { id: workout.userId } } } : {}),
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

    async listWorkouts(reqUserId: string, listWorkoutsDto: ListWorkoutsDto, status?: WorkoutStatus){
        const workouts = await this.prisma.workout.findMany({
            where: {
                userId: reqUserId,
                scheduledAt: {
                    gte: listWorkoutsDto.startDate,
                    lte: listWorkoutsDto.endDate
                },
                status: status
            },
            include: {workoutExercises: {include: {exercise: true}}},
            orderBy: {
                scheduledAt: 'asc'
            }
        })
        return workouts;
    }

    async report(userId){
        const endDate = new Date()
        var date = new Date()
        date.setDate(date.getDate() - 30)
        const startDate = date.toISOString()

        const workouts = await this.prisma.workout.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
            where: {
                scheduledAt: {
                    gte: startDate,
                    lte: endDate
                },
                userId,
                status:{
                    not: WorkoutStatus.SCHEDULED
                }
            }
        })

        const report = [
            {
                status: WorkoutStatus.COMPLETED,
                count: 0,
                percent: "0%"
            },
            {
                status: WorkoutStatus.MISSED,
                count: 0,
                percent: "0%"
            },
            {
                status: WorkoutStatus.CANCELLED,
                count: 0,
                percent: "0%"
            }
        ]
        var sum = 0;
        for(const workout of workouts){
            sum += workout._count.id;
        }
        for(const workout of workouts){
            if(workout.status == "COMPLETED") {
                report[0].count = workout._count.id;
                report[0].percent = ((workout._count.id / sum) * 100)+ "%"
            }
            if(workout.status == "MISSED"){
                report[1].count = workout._count.id;
                report[1].percent = ((workout._count.id / sum) * 100)+ "%"
            } 
            if(workout.status == "CANCELLED") {
                report[2].count = workout._count.id;
                report[2].percent = ((workout._count.id / sum) * 100)+ "%"
            }
        }

        return report;
    }

}
