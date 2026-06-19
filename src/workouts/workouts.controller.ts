import { Controller, Get, Post, UseGuards, Body,Param, Request, Put, ForbiddenException} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { WorkoutsService } from './workouts.service';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';

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

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string,@Body() updateWorkoutDto: UpdateWorkoutDto, @Request() req){
        if(req.userId === updateWorkoutDto.userId)
            throw new ForbiddenException()
        return this.workoutService.update(updateWorkoutDto,id)
    }
}
