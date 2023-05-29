import { Controller, Get, Post, Body, Param, Delete, ClassSerializerInterceptor, HttpException, HttpStatus, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Patch, Req, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

/**
 * @class UsersController
 * 
 * Une class permettant :
 * * De réunir plusieurs méthodes liées à l'accessibilité du client.
 * * De contrôler les informations entrantes, de les vérifier avant de les envoyer en base de données, suivant un protocole précis et renseigné.
 * * Celle-ci est dédiée à la création de comptes, à la recherche via des critères, à la modifification de données et à la suppression d'un compte client.
 */
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
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
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  @ApiOperation({ summary: "Création d'un compte client" })
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
  @ApiOperation({ summary: "Recherche des comptes clients" })
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
  @ApiOperation({ summary: "Recherche d'un compte client par son Id" })
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
  @ApiOperation({ summary: "Recherche des comptes clients par son email" })
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
  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: "Modifier les informations d'un compte client" })
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {

    const userLog = req.user.id

    const updateUser = await this.usersService.updateUser(userLog, updateUserDto);

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
  * * Le client doit être loger pour pouvoir supprimer son profil.
  */
  @ApiOperation({ summary: `suppression d'un compte client log` })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deletedUser(@Req() req) {

    const userLog = req.user.id

    const deleted = await this.usersService.deletedUser(userLog);

    if (!deleted) {
      throw new HttpException('Erreur Server', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { statusCode: 200,
      message: 'Suppression du compte client effectuée',
      data: deleted };
  }


  // Suppression d'un user par son id pour l'admin
  @ApiOperation({ summary: `suppression d'un compte utilisateur client par son id` })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {

    const userExist = await this.usersService.findUserByID(+id);

    if (!userExist) {
      throw new HttpException("Le client n'existe pas", HttpStatus.NOT_FOUND);
    }

    const deletedUser = await userExist.remove();

    if (!deletedUser) {
      throw new HttpException('Erreur Server', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      statusCode: 200,
      message: 'Suppression du compte client effectuée',
      data: deletedUser
    }

  }

}