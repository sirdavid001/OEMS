import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Req, Res } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { Prisma } from '@prisma/client'; // Added import for Prisma types
import { Request } from '@nestjs/common'; // Added import for Request

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  async findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  async create(@Body() createExamDto: Prisma.ExamCreateInput, @Request() req: any) { // Modified type of createExamDto
    return this.examsService.create({
      ...createExamDto,
      instructor: { connect: { id: req.user.userId } },
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  async update(@Param('id') id: string, @Body() updateExamDto: any) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
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

  @Get('attempt/:id/pdf')
  @Roles(Role.STUDENT, Role.INSTRUCTOR)
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    return this.examsService.generateResultPdf(id, res);
  }
}
