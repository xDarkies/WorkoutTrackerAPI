import { Controller, Get, Post, UseGuards, Body, Request, ForbiddenException} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkoutDto } from './createWorkout.dto';
import { WorkoutsService } from './workouts.service';

@Controller('api/workouts')
export class WorkoutsController {
    constructor(private workoutService: WorkoutsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createWorkoutDto: CreateWorkoutDto, @Request() req){
        if(req.userId === createWorkoutDto.userId)
            throw new ForbiddenException()
        return this.workoutService.create(createWorkoutDto)
    }
}
