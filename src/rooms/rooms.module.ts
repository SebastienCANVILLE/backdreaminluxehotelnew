import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { HotelsService } from 'src/hotels/hotels.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, HotelsService]
})
export class RoomsModule {}
