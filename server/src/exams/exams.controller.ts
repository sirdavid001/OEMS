import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Req, Res } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma, Role } from '@prisma/client';
import type { Response } from 'express';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.examsService.findAll(req.user);
  }

  @Get('my-exams')
  @Roles(Role.ADMIN, Role.LECTURER, Role.DEAN, Role.HOD)
  async findMyExams(@Req() req: any) {
    return this.examsService.findMyExams(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.LECTURER)
  async create(@Body() createExamDto: Prisma.ExamCreateInput, @Req() req: any) {
    return this.examsService.create({
      ...createExamDto,
      instructor: { connect: { id: req.user.userId } },
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LECTURER)
  async update(@Param('id') id: string, @Body() updateExamDto: any) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.LECTURER)
  async remove(@Param('id') id: string) {
    return this.examsService.delete(id);
  }

  @Post(':id/start')
  @Roles(Role.STUDENT)
  startAttempt(@Req() req: any, @Param('id') id: string) {
    return this.examsService.startAttempt(req.user.userId, id);
  }

  @Post('attempt/:id/submit')
  @Roles(Role.STUDENT)
  submitAttempt(@Param('id') id: string, @Body('answers') answers: any[]) {
    return this.examsService.submitAttempt(id, answers);
  }

  @Get('results')
  @Roles(Role.STUDENT)
  getResults(@Req() req: any) {
    return this.examsService.getResults(req.user.userId);
  }

  @Get('stats')
  async getStats(@Req() req: any) {
    if (req.user.role === Role.STUDENT) {
      return this.examsService.getStudentStats(req.user.userId);
    }
    if (req.user.role === Role.ADMIN) {
      return this.examsService.getAdminStats();
    }
    return this.examsService.getLecturerStats(req.user.userId);
  }

  @Get('attempt/:id/details')
  @Roles(Role.STUDENT, Role.LECTURER)
  getAttemptDetails(@Param('id') id: string) {
    return this.examsService.getAttemptDetails(id);
  }

  @Get('attempt/:id/pdf')
  @Roles(Role.STUDENT, Role.LECTURER)
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    return this.examsService.generateResultPdf(id, res);
  }

  @Get(':id/attempts')
  @Roles(Role.ADMIN, Role.LECTURER, Role.DEAN, Role.HOD)
  async getAttempts(@Param('id') id: string) {
    return this.examsService.getExamAttempts(id);
  }

  @Post('attempt/:id/grade')
  @Roles(Role.ADMIN, Role.LECTURER)
  async gradeAttempt(@Param('id') id: string, @Body('grades') grades: any[]) {
    return this.examsService.gradeAttempt(id, grades);
  }
}
