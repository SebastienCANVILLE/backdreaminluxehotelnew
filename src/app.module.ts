import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Comment } from './comments/entities/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { Hotel } from './hotels/entities/hotel.entity';
import { HotelsModule } from './hotels/hotels.module';
import { Reservation } from './reservations/entities/reservation.entity';
import { ReservationsModule } from './reservations/reservations.module';
import { Room } from './rooms/entities/room.entity';
import { RoomsModule } from './rooms/rooms.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres", 
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Comment, Hotel, Reservation, Room],
      synchronize: true,
      logging: false,
    }),
    AuthModule, CommentsModule, HotelsModule, ReservationsModule, RoomsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {constructor(private dataSource: DataSource) { }}
