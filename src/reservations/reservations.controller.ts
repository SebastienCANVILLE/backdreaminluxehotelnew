import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus, ClassSerializerInterceptor } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CheckDisponibilityDto } from './dto/check-disponibility.dto';
import { ConsultantGuard } from 'src/auth/consultant.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('reservations')
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

    // vérification que la date d'arrivée est inférieure ou égale à ma date de départ
    if (createReservationDto.arrival_date >= createReservationDto.departure_date) {
      throw new HttpException("La date de départ doit être supérieure à la date d'arrivée", HttpStatus.BAD_REQUEST);
    }

    // vérification que la date de départ ou d'arrivée n'est pas inférieure à la date d'aujourd'hui
    if (new Date(createReservationDto.arrival_date) <= new Date(Date.now()) || new Date(createReservationDto.departure_date) <= new Date(Date.now())) {
      throw new HttpException("La date choisie ne peux pas être antérieure à la date d'aujourd'hui", HttpStatus.BAD_REQUEST);
    }

    // Vérification de la disponibilité de la chambre
    const roomAvailable = await this.roomsService.roomAvailable(createReservationDto.roomId, createReservationDto.arrival_date, createReservationDto.departure_date);

    if (roomAvailable === false) {
      throw new HttpException("La chambre n'est pas disponible pour ces dates", HttpStatus.BAD_REQUEST);
    }

    // récupération du body via createReservation de l'user et de la chambre afin de lier les trois dans la création de la réservation
    const createReservation = await this.reservationsService.createReservation(createReservationDto, user, room);

    return {
      statusCode: 201,
      data: createReservation,
      message: "La réservation de votre chambre a bien été créé"
    }

  }
  

    /** 
* @method checkDisponibility :
* 
* Une méthode permettant de :
* * Controler les données entrantes lors du checking d'une chambre d'hotel.
* * Vérifier et imposer que les contraintes soient bien respectées.
* * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
*/
  @ApiBody({ type: CheckDisponibilityDto })
  @Post('/check')
  @ApiOperation({ summary: "Vérifier la disponibilité d'une chambre" })
  async checkDisponibility(@Body() checkDisponibilityDto: CheckDisponibilityDto) {

    // récupération de la chambre et vérification de son existance
    const room = await this.roomsService.findRoomByID(+checkDisponibilityDto.roomId);

    if (!room) {
      throw new HttpException("La chambre n'existe pas", HttpStatus.NOT_FOUND);
    }

    // vérification que la date d'arrivée est inférieure ou égale à ma date de départ
    if (checkDisponibilityDto.arrival_date >= checkDisponibilityDto.departure_date) {
      throw new HttpException("La date de départ doit être supérieure à la date d'arrivée", HttpStatus.BAD_REQUEST);
    }

    // vérification que la date de départ ou d'arrivée n'est pas inférieure à la date d'aujourd'hui
    if (new Date(checkDisponibilityDto.arrival_date) <= new Date(Date.now()) || new Date(checkDisponibilityDto.departure_date) <= new Date(Date.now())) {
      throw new HttpException("La date choisie ne peux pas être antérieure à la date d'aujourd'hui", HttpStatus.BAD_REQUEST);
    }

    // Vérification de la disponibilité de la chambre
    const roomAvailable = await this.roomsService.roomAvailable(checkDisponibilityDto.roomId, checkDisponibilityDto.arrival_date, checkDisponibilityDto.departure_date);

    if (roomAvailable === false) {
      throw new HttpException("La chambre n'est pas disponible pour ces dates", HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: 201,
      data: roomAvailable
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

    const reservationsExist = await this.reservationsService.findAllReservation();

    if (!reservationsExist) {
      throw new HttpException("Pas de réservations enregistrées", HttpStatus.NOT_FOUND);
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
  @UseGuards(JwtAuthGuard, ConsultantGuard)
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
  @UseGuards(JwtAuthGuard)
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
