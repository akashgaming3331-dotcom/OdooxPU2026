import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stops/:stopId/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  async getActivities(@Param('stopId') stopId: string) {
    const data = await this.activitiesService.getActivities(stopId);
    return { success: true, message: 'Activities fetched', data };
  }

  @Post()
  async addActivity(@Param('stopId') stopId: string, @Body() dto: any) {
    const data = await this.activitiesService.addActivity(stopId, dto);
    return { success: true, message: 'Activity added', data };
  }

  @Delete(':id')
  async deleteActivity(@Param('id') id: string) {
    await this.activitiesService.deleteActivity(id);
    return { success: true, message: 'Activity deleted' };
  }
}
