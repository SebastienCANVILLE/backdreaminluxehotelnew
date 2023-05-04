import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {

  /** 
  * @method createComment :
  * 
  * Method permettant de créer un commentaire suivant le modèle du CreateCommentDto.
  * * permet de lier le client àu commentaire lors de sa création.
  * * permet de lier le commentaire à l'hôtel lors de sa création.
  */
  async createComment(createCommentDto: CreateCommentDto, userIdComment: User, hotelIdComment: Hotel): Promise<Comment> {

    const newCommentary = Comment.create({ ...createCommentDto });
    newCommentary.user = userIdComment; // permet de lier le client àu commentaire
    newCommentary.hotel = hotelIdComment;// permet de lier le commentaire à l'hôtel

    await newCommentary.save()

    return newCommentary
  }

  /** 
  * @method findAllComment :
  * Method permettant de rechercher tous les commentaires.
  */
  async findAllComment(): Promise<Comment[]> {

    return await Comment.find();

  }

  /** 
* @method findCommentByID :
* Method permettant de rechercher un commentaire par son Id.
*/
  async findCommentByID(id: number): Promise<Comment> {

    return await Comment.findOneBy({ id: id })
  }


    /** 
  * @method deleteComment :
  * Method permettant de supprimer un commentaire.
  * * Recherche du commentaire
  * * Suppression de celle-ci grâce à .delete
  */
    async deleteComment(id: number): Promise<Comment> {

      const commentDeleted = await Comment.findOneBy({ id })
  
      await Comment.delete({ id });
  
      return commentDeleted;
    }
}
