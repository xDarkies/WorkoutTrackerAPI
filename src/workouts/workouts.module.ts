import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [WorkoutsService,PrismaService],
  controllers: [WorkoutsController]
})
export class WorkoutsModule {}
