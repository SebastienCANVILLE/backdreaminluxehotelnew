import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HotelsService } from '../hotels/hotels.service';
import { UsersService } from '../users/users.service';


@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService,
    private readonly hotelsService: HotelsService,
    private readonly usersService: UsersService) {}


  /** 
* @method createComment :
* 
* Une méthode permettant de :
* * Controler les données entrantes lors de la création d'une réservation.
* * Vérifier et imposer que les contraintes soient bien respectées.
* * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
*/
@ApiBody({ type: CreateCommentDto })
@UseGuards(JwtAuthGuard)
@Post()
@ApiOperation({ summary: "Création d'un commentaire" })
async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {

  // récupération de l'user et vérification de son existance
  const user = req.user;

  if (!user) {
    throw new HttpException("L'utilisateur n'existe pas", HttpStatus.NOT_FOUND);
  }

  // récupération de l'id de l'hôtel et vérification de son existance
  const hotel = await this.hotelsService.findHotelByID(+createCommentDto.hotelId);

  if (!hotel) {
    throw new HttpException("L'hôtel n'existe pas", HttpStatus.NOT_FOUND);
  }

  // récupération du body via createComment de l'user et de l'hôtel afin de lier les trois dans la création du commentaire
  const createComment = await this.commentsService.createComment(createCommentDto, user, hotel);

  return {
    statusCode: 201,
    data: createComment,
    message: "Le commentaire a bien été créé"
  }

}


  /** 
  * @method findAllComment :
  * 
  * Une méthode permettant de :
  * * Controler les données entrantes lors de la consultation de tous les commentaires.
  * * Renvoyer un message d'avertissement en cas d'erreur ou de succès..
  */
  @Get()
  @ApiOperation({ summary: "Recherche de tous les commentaires" })
  async findAllComment() {

    const commentsExist = await this.commentsService.findAllComment();

    if (!commentsExist) {
      throw new HttpException("Pas de commentaires enregistrés", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: commentsExist,
      message: "Voici la liste de tous les commentaires"
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
  @ApiOperation({ summary: "Recherche d'un commentaire" })
  async findReservationByID(@Param('id') id: string) {

    const commentExist = await this.commentsService.findCommentByID(+id);

    if (!commentExist) {
      throw new HttpException("Le commentaire n'existe pas", HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      data: commentExist,
      message: "Voici le commentaire"
    }
  }


/*   @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }
 */


  /** 
   * @method commentDelete :
   * 
   * Une méthode permettant de :
   * * Controler les données entrantes lors de la suppression d'un commentaire'.
   * * Renvoyer un message d'avertissement en cas d'erreur ou de succès.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Supprimer un commentaire" })
  async commentDelete(@Param('id') id: string) {

    const commentExist = await this.commentsService.findCommentByID(+id);

    if (!commentExist) {
      throw new HttpException("Le commentaire n'existe pas", HttpStatus.NOT_FOUND);
    }

    const deletedComment = await this.commentsService.deleteComment(+id);

    return {
      statusCode: 200,
      data: deletedComment,
      message: "Le commentaire a été supprimée"
    };
  }
}
