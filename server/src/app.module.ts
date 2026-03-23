import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ExamsModule, QuestionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
