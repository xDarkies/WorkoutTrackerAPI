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
    Delete,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { WorkoutsService } from './workouts.service';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { ListWorkoutsDto } from './dto/listWorkouts.dto';
import { WorkoutStatus } from '@prisma/client';


@Controller('api/workouts')
export class WorkoutsController {
    constructor(private workoutService: WorkoutsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    create(@Body() createWorkoutDto: CreateWorkoutDto, @Request() req){
        return this.workoutService.create(req.user.id,createWorkoutDto)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    update(@Param('id') id: string,@Body() updateWorkoutDto: UpdateWorkoutDto, @Request() req){
        return this.workoutService.update(req.user.id,updateWorkoutDto,id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    delete(@Param('id') id: string, @Request() req){
        this.workoutService.delete(req.user.id,id);
    }

    @Patch('schedule/:id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    updateSchedule(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto,@Request() req){
        return this.workoutService.updateSchedule(req.user.id,updateScheduleDto,id);
    }

    @Patch('mark/:id')
    @UseGuards(JwtAuthGuard)
    markAs(@Param('id') id: string, @Query('status') status: WorkoutStatus, @Request() req){
        return this.workoutService.markAs(req.user.id, status, id);
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    listWorkouts(@Body() listWorkoutsDto: ListWorkoutsDto, @Request() req,@Query('status') status?: WorkoutStatus){
        return this.workoutService.listWorkouts(req.user.id, listWorkoutsDto, status);
    }

    @Get('report')
    @UseGuards(JwtAuthGuard)
    report(@Request() req){
        return this.workoutService.report(req.user.id)
    }
}
