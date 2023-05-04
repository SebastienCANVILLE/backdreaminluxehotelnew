import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { HotelsService } from 'src/hotels/hotels.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, HotelsService, UsersService]
})
export class CommentsModule {}
