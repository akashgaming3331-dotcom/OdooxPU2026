import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/trips.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  async create(@Request() req: any, @Body() dto: CreateTripDto) {
    const data = await this.tripsService.create(req.user.id, dto);
    return { success: true, message: 'Trip created successfully', data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips for current user' })
  async findAll(@Request() req: any) {
    const data = await this.tripsService.findAll(req.user.id);
    return { success: true, message: 'Trips fetched successfully', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific trip with all nested data' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    const data = await this.tripsService.findOne(id, req.user.id);
    return { success: true, message: 'Trip fetched successfully', data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a trip' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: any) {
    const data = await this.tripsService.updateTrip(id, req.user.id, dto);
    return { success: true, message: 'Trip updated', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trip' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.tripsService.deleteTrip(id, req.user.id);
    return { success: true, message: 'Trip deleted' };
  }
}
