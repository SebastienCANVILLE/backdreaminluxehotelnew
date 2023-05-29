import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { HotelsService } from '../hotels/hotels.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, HotelsService, UsersService]
})
export class CommentsModule {}
