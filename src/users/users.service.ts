import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * @class UsersService :
 * Une class permettant de gérer les requêtes SQL de plusieurs méthodes CRUD.
*/
@Injectable()
export class UsersService {
  deletedAmi: any;

  /** 
    * @method create :
    * Method permettant de créer un utlisateur suivant le modèle du CreatUserDto.
    * * Crypter le password grâce au hash/bcrypt lors de la création du compte client.
    */
  async createUser(createUserDto: CreateUserDto): Promise<User> { // Promise (promet de te renvoyer un user)

    const user = User.create(createUserDto)
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(createUserDto.password, user.salt);
    await user.save()
    //delete user.password
    //delete user.salt
    return user

  }

  /** 
    * @method findAll :
    * Method permettant de rechercher tous les utilisateurs.
    */
  async findAllUser(): Promise<User[]> { // recherche de tous les users
    return await User.find();
  }


  /** 
  * @method findUserByID :
  * Method permettant de rechercher tous les utilisateurs par son Id.
  */
  async findUserByID(id: number): Promise<User> {
    console.log(id);

    return await User.findOneBy({ id: id })
  }


  /** 
  * @method findByEmail :
  * Method permettant de rechercher un utilisateur via son email.
  */
  async findUserByEmail(email: string) {
    return await User.findOneBy({ email });
  }


  /** 
  * @method update :
  * Method permettant de mettre à jour son profil via un template définit par UpdateUserDto/par extension createUserDTO.
  */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {

    const updateUser = await User.findOneBy({ id: id });

    updateUser.email = updateUserDto.email;
    updateUser.password = updateUserDto.password;
    updateUser.lastname = updateUserDto.lastname;
    updateUser.firstname = updateUserDto.firstname;
    updateUser.adress_line = updateUserDto.adress_line;
    updateUser.zipCode = updateUserDto.zipCode;
    updateUser.city = updateUserDto.city;
    updateUser.country = updateUserDto.country;

    await User.save(updateUser);

    return updateUser
  }


  /** 
  * @method deletedUser :
  * Method permettant de supprimer l'utlisateur connecté.
  * Avec cette méthode impossible qu'un utilisateur puisse supprimer un autre utilisateur via son id
  */
  async deletedUser(id: number): Promise<User> { // permet la suppression de l'user par l'id

    const dataDeleted = await User.findOneBy({ id })
    await User.delete({ id });

    if (dataDeleted) {
      return dataDeleted;
    }

    return undefined;
  }

}