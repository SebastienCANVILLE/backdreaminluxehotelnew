import { Injectable } from '@nestjs/common';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reservation } from 'src/reservations/entities/reservation.entity';


@Injectable()
export class RoomsService {

  /** 
  * @method createRoom :
  * 
  * Method permettant de créer une chambre suivant le modèle du CreatRoomDto.
  * permet de lier la chambre à l'hotel lors de sa création
  */
  async createRoom(hotelReference: Hotel, createRoomDto: CreateRoomDto): Promise<Room> {

    const newRoom = Room.create({ ...createRoomDto })
    newRoom.hotel = hotelReference // permet de lier la chambre à l'hotel lors de sa création

    await newRoom.save()

    return newRoom
  }


  /** 
    * @method findAllRoom :
    * Method permettant de rechercher toutes les chambres.
    */
  async findAllRoom(): Promise<Room[]> {

    return await Room.find();
  }


  /** 
 * @method findHotelByID :
 * Method permettant de rechercher une chambre par son Id.
 */
  async findRoomByID(id: number): Promise<Room> {

    return await Room.findOneBy({ id: id })
  }


  /** 
  * @method findRoomByNumber :
  * Method permettant de rechercher une chambre par son numéro.
  * utiliser dans le controller de createRoom pour ne pas avoir un doublon de chambre avec le même numéro mais également pouvoir utiliser ce même numéro dans un autre hotel.
  * si l'array de la réservation renvoi zéro, ca veut dire que la chambre est libre et renvoi true sinon false chambre indisponible.
  */
  async findRoomByNumber(number: string): Promise<Room> {
    return await Room.findOneBy({ number_room: number });
  }


  /**
   * @method roomAvailable :
   * méthode permettant de vérifier si la chambre selectionnée est disponible par un checking des dates entre les dates d'une réservation déjà
   * existantes pour la dîtes chambre et les nouvelles dates saisies.
   */
  async roomAvailable(roomId: number, arrivalDate: Date, departureDate: Date): Promise<Boolean> {    

    const reservation = await Reservation.find({
      where: {
        room: { id: roomId },
        departure_date: MoreThanOrEqual(arrivalDate), // signifie que la date de départ doit être supérieure ou égale à la date d'arrivée de la période
        arrival_date: LessThanOrEqual(departureDate), // signifie que la date d'arrivée doit être inférieure ou égale à la date de départ de la période 
      }
    });
    console.log(reservation, reservation.length === 0);

    return reservation.length === 0; // true disponible / false indisponible
  }


  /** 
  * @method findRoomByNumberAndHotel :
  * Method permettant de rechercher une chambre par son numéro.
  * utiliser dans le controller de createRoom pour ne pas avoir un doublon de chambre avec le même numéro.
  */
  async findRoomByNumberAndHotel(number: string, hotel: Hotel): Promise<Room> {
    return await Room.findOne({
      where: {
        number_room: number,
        hotel: {
          id: hotel.id
        }
      }
    });
  }


  /** 
  * @method updateHotel :
  * 
  * Method permettant de mettre à jour les informations d'une chambre via un template définit par UpdateRoomDto.
  * * Récupération de la chambre que l'on veut modifier par son id
  * * Mofification d'une ou plusieurs données dans le body
  * * Sauvegarde des nouvelles informations en BDD
  */
  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {

    const room = await Room.findOneBy({ id });

    room.name = updateRoomDto.name
    room.number_room = updateRoomDto.number_room;
    room.price = updateRoomDto.price;

    await room.save()

    return room
  }


  /** 
  * @method deleteRoom :
  * Method permettant de supprimer une chambre.
  * * Recherche de l'hotel
  * * Suppression de celle-ci grâce à .delete
  */
  async deleteRoom(id: number): Promise<Room> {

    const roomDeleted = await Room.findOneBy({ id })
    await Room.delete({ id });

    return roomDeleted;
  }

}



//En attente ------------------------------------------------
/* const reservation = await Reservation.find({
      where: [
        // vérification de la date de départ  
        {
          room: { id: roomId },
          arrival_date: LessThanOrEqual(arrivalDate),
          departure_date: MoreThanOrEqual(arrivalDate),

        },
        //vérification de la date d'arrivée
        {
          room: { id: roomId },
          arrival_date: LessThanOrEqual(departureDate),
          departure_date: MoreThanOrEqual(departureDate),
        },
      ]

    }); */

//------------------------------------------------------------