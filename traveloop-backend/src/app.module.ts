import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TripsModule } from './trips/trips.module';
import { StopsModule } from './stops/stops.module';
import { ActivitiesModule } from './activities/activities.module';
import { BudgetModule } from './budget/budget.module';
import { NotesModule } from './notes/notes.module';
import { PackingModule } from './packing/packing.module';

@Module({
  imports: [PrismaModule, AuthModule, TripsModule, StopsModule, ActivitiesModule, BudgetModule, NotesModule, PackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
