import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpStatus, HttpException } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) { }


  /** 
   * @method createHotel :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la création d'un hotel.
   * * Vérifier et imposer que les contraintes soient bien respectées.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
   */
  @ApiBody({ type: CreateHotelDto })
  @Post()
  @ApiOperation({ summary: "Création d'un hôtel" })
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    
    const nameHotelExist = await this.hotelsService.findHotelByName(createHotelDto.name_hotel);

    if(nameHotelExist){
      console.log("Le nom de l'hôtel exist déjà");
      
      throw new HttpException("Le nom de l'hôtel exist déjà", HttpStatus.CONFLICT);      
    }

    const createHotel = await this.hotelsService.createHotel(createHotelDto);

    return {
      statusCode: 201,
      data: createHotel,
      message: "L'hôtel a bien été créé"
    }

  }


  /** 
  * @method findAllHotel :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la consultation de tous les hôtels.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès..
  */
  @Get()
  @ApiOperation({ summary: "Recherche de tous les hôtels" })
  async findAllHotel() {

    const hotelExist = await this.hotelsService.findAllHotel();

    if (!hotelExist) {
      throw new HttpException("Pas d'hôtel enregistré", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: hotelExist,
      message: "Voici la liste des hôtels"
    }
  }


  /** 
   * @method findHotelByID :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la consultation d'un hôtel via son id.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  */
  @Get(':id')
  @ApiOperation({ summary: "Recherche d'un hôtels" })
  async findHotelByID(@Param('id') id: string) {

    const hotelExist = await this.hotelsService.findHotelByID(+id);

    if (!hotelExist) {
      throw new HttpException("L'hôtel n'existe pas", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: hotelExist,
      message: "Voici votre hôtel"
    }
  }


  /** 
    * @method updateHotel :
    * 
    * Une méthode permettant de :
    * * Controler les données entrantes lors de la modification des données de l'hotel.
    * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
    */
  @Patch(':id')
  @ApiOperation({ summary: "Modifier les informations d'un hôtel" })
  async updateHotel(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {

    const nameHotelExist = await this.hotelsService.findHotelByName(updateHotelDto.name_hotel);

    if(nameHotelExist){
      console.log("Le nom de l'hôtel exist déjà");
      
      throw new HttpException("Le nom de l'hôtel exist déjà", HttpStatus.CONFLICT);      
    }

    const hotelExist = await this.hotelsService.findHotelByID(+id);

    if (!hotelExist) {
      throw new HttpException("L'hotel n'existe pas", HttpStatus.NOT_FOUND);
    }

    const updateHotel = await this.hotelsService.updateHotel(+id, updateHotelDto);

    return {
      statusCode: 200,
      data: updateHotel,
      message: 'Les modifications ont bien été prisent en compte'
    };
  }


  /** 
  * @method hotelDelete :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la suppression d'un hotel'.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  */
  @Delete(':id')
  @ApiOperation({ summary: "Supprimer un hôtel" })
  async hotelDelete(@Param('id') id: number) {

    const hotelExist = await this.hotelsService.findHotelByID(id);

    if (!hotelExist) {
      throw new HttpException("L'hôtel n'existe pas", HttpStatus.NOT_FOUND)
    }
    
    const deletedHotel = await this.hotelsService.deleteHotel(id);

    return {
      statusCode: 200,
      data: deletedHotel,
      message: "L'hôtel a été supprimé"
    };
  }
}
