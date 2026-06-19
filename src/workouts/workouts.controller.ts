import { 
    Controller, 
    Get, 
    Post, 
    UseGuards, 
    Body, 
    Param, 
    Request, 
    Put, 
    Patch,
    ForbiddenException,
    Delete,
    Query
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { WorkoutsService } from './workouts.service';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { WorkoutStatus } from '@prisma/client';

@Controller('api/workouts')
export class WorkoutsController {
    constructor(private workoutService: WorkoutsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createWorkoutDto: CreateWorkoutDto, @Request() req){
        return this.workoutService.create(req.userId,createWorkoutDto)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string,@Body() updateWorkoutDto: UpdateWorkoutDto, @Request() req){
        return this.workoutService.update(req.userId,updateWorkoutDto,id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string, @Request() req){
        this.workoutService.delete(req.userId,id);
    }

    @Patch('schedule/:id')
    @UseGuards(JwtAuthGuard)
    updateSchedule(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto,@Request() req){
        return this.workoutService.updateSchedule(req.userId,updateScheduleDto,id);
    }

    @Patch('mark/:id')
    @UseGuards(JwtAuthGuard)
    markAs(@Param('id') id: string, @Query('status') status: WorkoutStatus, @Request() req){
        return this.workoutService.markAs(req.userId, status, id);
    }
}
