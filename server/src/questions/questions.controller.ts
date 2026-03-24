import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.LECTURER)
  async create(@Body() createQuestionDto: any) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get('exam/:examId')
  async findByExam(@Param('examId') examId: string) {
    return this.questionsService.findByExam(examId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LECTURER)
  async update(@Param('id') id: string, @Body() updateQuestionDto: any) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.LECTURER)
  async remove(@Param('id') id: string) {
    return this.questionsService.delete(id);
  }
}
