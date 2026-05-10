import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StopsService } from './stops.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Stops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stops for a trip' })
  async getStops(@Param('tripId') tripId: string) {
    const data = await this.stopsService.getStops(tripId);
    return { success: true, message: 'Stops fetched', data };
  }

  @Post()
  @ApiOperation({ summary: 'Add a stop to a trip' })
  async addStop(@Param('tripId') tripId: string, @Body() dto: any) {
    const data = await this.stopsService.addStop(tripId, dto);
    return { success: true, message: 'Stop added', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stop' })
  async deleteStop(@Param('id') id: string) {
    await this.stopsService.deleteStop(id);
    return { success: true, message: 'Stop deleted' };
  }
}
