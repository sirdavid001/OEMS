import { Controller, Get, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return [];
    return this.usersService.getManagedUsers(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() data: any) {
    return this.usersService.update(req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async getPending(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return [];
    return this.usersService.getPendingApprovals(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: 'APPROVED' | 'REJECTED') {
    const approver = await this.usersService.findById(req.user.userId);
    if (!approver) throw new Error('Approver not found');
    return this.usersService.updateStatus(id, status, approver);
  }
}
