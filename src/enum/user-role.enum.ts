/**
 *  @class UserRoleEnum
 * 
 * Class permettant de définir les trois rôles de l'application :
 * 
 * * ADMIN rôle suprême en droit
 * * CONSULTANT rôle de consultation des réservations (GET All / Id)
 * * USER rôle, faire des réservations de chambres 
 */

export enum UserRoleEnum{

    ADMIN ='admin',
    CONSULTANT = 'consultant',
    USER = 'user'
}