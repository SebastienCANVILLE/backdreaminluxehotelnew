import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService, RoomsService, UsersService]
})
export class ReservationsModule {}
