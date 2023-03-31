import { Controller, Get, Post, Body, Param, Delete, ClassSerializerInterceptor, HttpException, HttpStatus, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Patch, Req, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
//import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

/**
 * @class UsersController
 * 
 * Une class permettant :
 * * De réunir plusieurs méthodes liées à l'accessibilité du client.
 * * De contrôler les informations entrantes, de les vérifier avant de les envoyer en base de données, suivant un protocole précis et renseigné.
 * * Celle-ci est dédiée à la création de comptes, à la recherche via des critères, à la modifification de données et à la suppression d'un compte client.
 */
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor) // permet de cacher les données lors d'une requête (password etc...) grâce à l'exclude de l'entity.
@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /** 
   * @method createUser :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la création d'un compte client.
   * * Vérifier et imposer que les contraintes soient bien respectées.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
   */

  @Post('register')
  @ApiProperty()
  async createUser(@Body() createUserDto: CreateUserDto) {

    if (createUserDto.password !== createUserDto.password_confirm) {
      throw new ConflictException("Les mots de passe doivent être identiques")
    }

    const emailExist = await this.usersService.findUserByEmail(createUserDto.email);

    if (emailExist) {
      throw new HttpException("L'Email est déjà utilisé", HttpStatus.BAD_REQUEST);
    }

    const createUser = await this.usersService.createUser(createUserDto);

    return {
      statusCode: 201,
      data: createUser,
      message: "Création réussi de votre compte utilisateur"
    }
  }

  /** 
  * @method findAllUser :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la consultation de tous les utilisateurs.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès..
  */

  @Get()
  @ApiProperty()
  async findAllUser() {

    const usersExist = await this.usersService.findAllUser();

    if (!usersExist) {
      throw new HttpException("Aucun compte client enregistré", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: usersExist,
      message: "Voici la liste des comptes clients"
    }
  }


  /** 
   * @method findUserByID :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la consultation d'un utlisateur via son id.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  */

  @Get(':id')
  @ApiProperty()
  async findUserByID(@Param('id') id: string) {

    const userExist = await this.usersService.findUserByID(+id);

    if (!userExist) {
      throw new HttpException("L'utilisateur n'existe pas", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: userExist,
      message: "Voici le compte client"
    }
  }


  /** 
  * @method findUserByEmail :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes la recherche d'un compte client via son email.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès..
  */

  @Get('email/:email')
  @ApiProperty()
  async findUserByEmail(@Param('email') email: string) {

    const emailExist = await this.usersService.findUserByEmail(email);

    if (!emailExist) {

      throw new HttpException("L'Email n'existe pas", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: emailExist,
      message: "Voici le compte client"
    }
  }


  /** 
  * @method update :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la modification du profil par un client.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  * * Le client doit être loger pour modifier son profil. Il ne peut modifier le profil d'un autre
  */

  //@UseGuards(JwtAuthGuard)
  @Patch()
  @ApiProperty()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {

    const userLog = req.user.id
    const updateUser = await this.usersService.updateUser(userLog, updateUserDto,);

    return {
      statusCode: 200,
      message: 'Les modifications ont bien été prisent en compte',
      data: {
        updateUser,
      },
    };
  }


  /** 
  * @method deletedUser :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la suppression du profil par un user.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
  * * Le développeur doit être loger pour pouvoir supprimer son profil. Il ne peut modifier le profil d'un autre
  */

  //@UseGuards(JwtAuthGuard)
  @Delete()
  @ApiProperty()
  async deletedUser(@Req() req) {

    const id = req.user.id

    const user = await this.usersService.findUserByID(id);

    if (!user) {
      throw new HttpException(`L'user demandé n'existe pas`, HttpStatus.NOT_FOUND);
    }

    const deleted = await this.usersService.deletedUser(id);

    if (!deleted) {
      throw new HttpException('Erreur Server', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { message: `Le compte a bien été supprimé` };
  }

}