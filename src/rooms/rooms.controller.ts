import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHotelDto } from 'src/hotels/dto/create-hotel.dto';
import { HotelsService } from 'src/hotels/hotels.service';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService,
    private readonly hotelsService: HotelsService) { }

  /** 
 * @method createHotel :
 * 
 * Une méthode permettant de :
 * * Controler les données entrantes lors de la création d'un hotel.
 * * Vérifier et imposer que les contraintes soient bien respectées.
 * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
 */
  @ApiBody({ type: CreateRoomDto })
  @Post('register/:id')
  @ApiOperation({ summary: "Création d'une chambre" })
  async createRoom(@Param('id') hotelId: string, @Body() createRoomDto: CreateRoomDto, @Req() req) {

    //récupération de l'hotel afin d'injecter la room à son actif, attribué dans le params
    const hotel = await this.hotelsService.findHotelByID(+hotelId);

    if (!hotel) {
      throw new HttpException("L'hôtel n'existe pas", HttpStatus.NOT_FOUND);
    }

    // permet la vérification de l'existance du numéro de chambre dans un hotel précis pour ne pas à avoir un doublon
    const numberRoomExist = await this.roomsService.findRoomByNumberAndHotel(createRoomDto.number_room, hotel);

    if (numberRoomExist) {
      throw new HttpException("Le numéro de la chambre exist déjà", HttpStatus.CONFLICT);
    }

    const createRoom = await this.roomsService.createRoom(hotel, createRoomDto);

    return {
      statusCode: 201,
      data: createRoom,
      message: "La chambre a bien été créé"
    }

  }


  /** 
  * @method findAllHotel :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la consultation de toutes les chambres.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès..
  */
  @Get()
  @ApiOperation({ summary: "Recherche de toutes les chambres" })
  async findAllRoom() {

    const roomExist = await this.roomsService.findAllRoom();

    if (!roomExist) {
      throw new HttpException("Pas de chambre enregistrée", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: roomExist,
      message: "Voici la liste des chambres"
    }
  }


  /** 
   * @method findRoomByID :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la consultation d'une chambre via son id.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  */
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'une chambre" })
  async findHotelByID(@Param('id') id: string) {

    const roomExist = await this.roomsService.findRoomByID(+id);

    if (!roomExist) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: roomExist,
      message: "Voici votre chambre"
    }
  }


  /** 
    * @method updateRoom :
    * 
    * Une méthode permettant de :
    * * Controler les données entrantes lors de la modification des données de l'hotel.
    * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
    */
  @Patch(':id')
  @ApiOperation({ summary: "Modifier les informations d'une chambre" })
  async updateRoom(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {

    const roomExist = await this.roomsService.findRoomByID(+id);

    if (!roomExist) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    const numberRoomExist = await this.roomsService.findRoomByNumber(updateRoomDto.number_room);

    if (numberRoomExist) { // à certifier avec findRoomByNumberAndHotel
      throw new HttpException("Le numéro de la chambre exist déjà", HttpStatus.CONFLICT);
    }

    const updateRoom = await this.roomsService.updateRoom(+id, updateRoomDto);

    return {
      statusCode: 200,
      data: updateRoom,
      message: 'Les modifications ont bien été prisent en compte'
    };
  }


  /** 
  * @method roomDelete :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la suppression d'une chambre'.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  */
  @Delete(':id')
  @ApiOperation({ summary: "Supprimer une chambre" })
  async roomDelete(@Param('id') id: number) {

    const roomExist = await this.roomsService.findRoomByID(+id);

    if (!roomExist) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    const deletedHotel = await this.roomsService.deleteRoom(id);

    return {
      statusCode: 200,
      data: deletedHotel,
      message: "La chambre a été supprimée"
    };
  }
}
