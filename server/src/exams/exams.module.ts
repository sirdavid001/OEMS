import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { ExamGateway } from './exam/exam.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [ExamsService, ExamGateway],
  controllers: [ExamsController],
  exports: [ExamsService],
})
export class ExamsModule {}
