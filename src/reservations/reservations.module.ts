import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RoomsModule,UsersModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, RoomsService, UsersService]
})
export class ReservationsModule {}
