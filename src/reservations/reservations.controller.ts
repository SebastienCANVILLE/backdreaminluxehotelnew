import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus, ClassSerializerInterceptor } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Rooms')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService,
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService) { }


  /** 
* @method createReservation :
* 
* Une méthode permettant de :
* * Controler les données entrantes lors de la création d'une réservation.
* * Vérifier et imposer que les contraintes soient bien respectées.
* * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
*/
  @ApiBody({ type: CreateReservationDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Création d'une réservation" })
  async createReservation(@Body() createReservationDto: CreateReservationDto, @Req() req) {

    // récupération de l'user et vérification de son existance
    const user = req.user;

    if (!user) {
      throw new HttpException("L'utilisateur n'existe pas", HttpStatus.NOT_FOUND);
    }

    // récupération de la chambre et vérification de son existance
    const room = await this.roomsService.findRoomByID(+createReservationDto.roomId);

    if (!room) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    // Vérification de la disponibilité de la chambre
    const roomAvailable = await this.roomsService.roomAvailable(createReservationDto.roomId, createReservationDto.arrival_date, createReservationDto.departure_date);

    if (roomAvailable === false) {
      throw new HttpException("La chambre n'est pas disponible pour ces dates", HttpStatus.BAD_REQUEST);
    }

    //const ref = Math.random()
    // récupération du body via createReservation de l'user et de la chambre afin de lier les trois dans la création de la réservation
    const createReservation = await this.reservationsService.createReservation(createReservationDto, user, room);

    return {
      statusCode: 201,
      data: createReservation,
      message: "La réservation de votre chambre a bien été créé"
    }

  }


  /** 
  * @method findAllReservation :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la consultation de toutes les réservations.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès..
  */
  @Get()
  @ApiOperation({ summary: "Recherche de toutes les réservations" })
  async findAllReservation() {

    const reservationsExist = await this.reservationsService.findAllReservation(); // CA MARCHE PAS !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log(reservationsExist);

    if (!reservationsExist) {
      throw new HttpException("Pas de réservations enregistrée", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: reservationsExist,
      message: "Voici la liste des réservations"
    }
  }


  /** 
   * @method findReservationByID :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la consultation d'une réservation via son id.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  */
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'une réservation" })
  async findReservationByID(@Param('id') id: string) {

    const reservationExist = await this.reservationsService.findReservationByID(+id);

    if (!reservationExist) {
      throw new HttpException("La réservation n'existe pas", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: reservationExist,
      message: "Voici votre réservation"
    }
  }


  /** 
    * @method updateReservation :
    * 
    * Une méthode permettant de :
    * * Controler les données entrantes lors de la modification des données de la réservation.
    * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
    */
  @Patch(':id')
  @ApiOperation({ summary: "Modifier la réservation d'une chambre" })
  async updateReservation(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {

    const reservationExist = await this.reservationsService.findReservationByID(+id);

    if (!reservationExist) {
      throw new HttpException("La réservation n'existe pas", HttpStatus.NOT_FOUND);
    }

    const room = await this.roomsService.findRoomByID(+updateReservationDto.roomId);

    if (!room) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    // Vérification de la disponibilité de la chambre
    const roomAvailable = await this.roomsService.roomAvailable(updateReservationDto.roomId, updateReservationDto.arrival_date, updateReservationDto.departure_date);

    if (roomAvailable === false) {
      throw new HttpException("La chambre n'est pas disponible pour ces dates", HttpStatus.BAD_REQUEST);
    }

    //const updateReservation = await this.reservationsService.updateReservation(id)
    reservationExist.arrival_date = updateReservationDto.arrival_date;
    reservationExist.departure_date = updateReservationDto.departure_date;
    reservationExist.room = room;

    await reservationExist.save()

    return {
      statusCode: 200,
      data: reservationExist,
      message: 'Les modifications ont bien été prisent en compte'
    };
  }


  /** 
   * @method reservationDelete :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la suppression d'une réservation'.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
   */
  @Delete(':id')
  @ApiOperation({ summary: "Supprimer une réservation" })
  async reservationDelete(@Param('id') id: string) {

    const reservationExist = await this.reservationsService.findReservationByID(+id);

    if (!reservationExist) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    const deletedReservation = await this.reservationsService.deleteReservation(+id);

    return {
      statusCode: 200,
      data: deletedReservation,
      message: "La réservation a été supprimée"
    };
  }


}
