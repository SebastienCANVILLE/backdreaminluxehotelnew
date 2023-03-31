import { Injectable } from '@nestjs/common';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {

  /** 
  * @method createReservation :
  * 
  * Method permettant de créer une chambre suivant le modèle du CreatRoomDto.
  * permet de lier le client à la réservation lors de sa création.
  * permet de lier la chambre à la réservation lors de sa création.
  */
    async createReservation(createReservationDto: CreateReservationDto, userReservation : User, roomReservation : Room, ): Promise<Reservation> {

      const newReservation = Reservation.create({ ...createReservationDto })
      newReservation.user = userReservation // permet de lier le client à la réservation
      newReservation.room = roomReservation // permet de lier la chambre à la réservation
  
      await newReservation.save()
  
      return newReservation
    }
















  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
