import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';


/**
 * @class HotelsService :
 * Une class permettant de gérer les requêtes SQL de plusieurs méthodes du CRUD.
*/
@Injectable()
export class HotelsService {

  /** 
  * @method createHotel :
  * 
  * Method permettant de créer un hotel suivant le modèle du CreatHotelDto.
  */
  async createHotel(createHotelDto: CreateHotelDto): Promise<Hotel> {

    const newHotel = Hotel.create({ ...createHotelDto })

    await newHotel.save()

    return newHotel

  }


  /** 
    * @method findAllHotel :
    * Method permettant de rechercher tous les hôtels.
    */
  async findAllHotel(): Promise<Hotel[]> {

    return await Hotel.find();

  }


  /** 
 * @method findHotelByID :
 * Method permettant de rechercher un hôtel par son Id.
 */
  async findHotelByID(id: number): Promise<Hotel> {

    return await Hotel.findOneBy({ id: id })

  }


  /** 
  * @method findHotelByName :
  * Method permettant de rechercher un hôtel par son nom.
  */
  async findHotelByName(name: string) {
    return await Hotel.findOneBy({ name_hotel : name });
  }


  /** 
  * @method updateHotel :
  * 
  * Method permettant de mettre à jour les informations de l'hôtel via un template définit par UpdateHotelsDto.
  * * Récupération le l'hotel que l'on veut modifier par son id
  * * Mofification d'une ou plusieurs données dans le body
  * * Sauvegarde des nouvelles informations en BDD
  */
  async updateHotel(id: number, updateHotelDto: UpdateHotelDto): Promise<Hotel> {

    const hotel = await Hotel.findOneBy({ id }); // const permettant de retrouver une présentation par son id

    hotel.name_hotel = updateHotelDto.name_hotel; // hotel.name = donnée actuelle ; updatePresentationDto.name = nouvelle donnée
    hotel.adress_line = updateHotelDto.adress_line;
    hotel.zipCode = updateHotelDto.zipCode;
    hotel.city = updateHotelDto.city;
    hotel.phone_number = updateHotelDto.phone_number;

    await hotel.save()

    return hotel
  }


  /** 
  * @method deleteHotel :
  * Method permettant de supprimer un hotel.
  * * Recherche de l'hotel
  * * Suppression de celui-ci grâce à .delete
  */
  async deleteHotel(id: number): Promise<Hotel> {

    const hotelDeleted = await Hotel.findOneBy({ id })
    await Hotel.delete({ id });

    return hotelDeleted;
  }

}
