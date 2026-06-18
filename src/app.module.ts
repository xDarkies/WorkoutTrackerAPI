import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { WorkoutsModule } from './workouts/workouts.module';

@Module({
  imports: [UsersModule, AuthModule, WorkoutsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
