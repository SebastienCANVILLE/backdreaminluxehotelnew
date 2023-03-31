import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiTags('Rooms')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService,
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService) { }


  @Post()
  /** 
* @method createHotel :
* 
* Une méthode permettant de :
* * Controler les données entrantes lors de la création d'un hotel.
* * Vérifier et imposer que les contraintes soient bien respectées.
* * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
*/
  @ApiBody({ type: CreateReservationDto })
  @UseGuards(JwtAuthGuard)
  @Post('register/:id')
  @ApiOperation({ summary: "Création d'une chambre" })
  async createReservation(@Body() id: string, createReservationDto: CreateReservationDto, @Req() req) {

    const room = await this.roomsService.findRoomByID(+id);

    if (!room) {
      throw new HttpException("La chambre n'exist pas", HttpStatus.NOT_FOUND);
    }

    const user = await this.usersService.findUserByID(req.user)

    if (!user) {
      throw new HttpException("L'hôtel n'existe pas", HttpStatus.NOT_FOUND);
    }

    // suppression de la const user et mettre req.user
    // test connecter le bearer et faire la creéation de la réservation
    const createRoom = await this.reservationsService.createReservation(createReservationDto, user, room); 

    return {
      statusCode: 201,
      data: createRoom,
      message: "L'hôtel a bien été créé"
    }

  }




















  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
