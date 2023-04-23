import { Injectable } from '@nestjs/common';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationsService {

  /** 
  * @method createReservation :
  * 
  * Method permettant de créer une chambre suivant le modèle du CreatRoomDto.
  * permet de lier le client à la réservation lors de sa création.
  * permet de lier la chambre à la réservation lors de sa création.
  */
  async createReservation(createReservationDto: CreateReservationDto, userReservation: User, roomReservation: Room): Promise<Reservation> {

    const newReservation = Reservation.create({ ...createReservationDto });
    newReservation.reference = uuidv4(); //génère un numéro de série aléatoire
    newReservation.user = userReservation; // permet de lier le client à la réservation
    newReservation.room = roomReservation;// permet de lier la chambre à la réservation

    await newReservation.save()

    return newReservation
  }


  /** 
  * @method findAllReservation :
  * Method permettant de rechercher toutes les réservations.
  */
  async findAllReservation(): Promise<Reservation[]> {

    return await Reservation.find();
  }


  /** 
  * @method findReservationByID :
  * Method permettant de rechercher une réservation par son Id.
  */
  async findReservationByID(id: number): Promise<Reservation> {

    return await Reservation.findOneBy({ id: id })
  }


  /** 
  * @method updateReservation :
  * 
  * Method permettant de mettre à jour les informations d'une réservation via un template définit par UpdateRoomDto.
  * * Récupération de la réservation que l'on veut modifier via son id
  * * Mofification d'une ou plusieurs données dans le body
  * * Sauvegarde des nouvelles informations en BDD
  */
  async updateReservation(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {

    // const permettant de retrouver une réservation par son id
    const reservation = await Reservation.findOneBy({ id });

    // const permettant de retrouver une chambre par son id
    const room = await Room.findOneBy({ id });

    await reservation.save()

    return reservation
  }


  /** 
  * @method deleteReservation :
  * Method permettant de supprimer une réservation.
  * * Recherche de la reservation
  * * Suppression de celle-ci grâce à .delete
  */
  async deleteReservation(id: number): Promise<Reservation> {

    const reservationDeleted = await Reservation.findOneBy({ id })

    await Reservation.delete({ id });

    return reservationDeleted;
  }


}


