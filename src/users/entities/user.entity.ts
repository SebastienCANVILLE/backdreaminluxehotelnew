import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from "../../enum/user-role.enum";
import { Reservation } from "../../reservations/entities/reservation.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Hotel } from "../../hotels/entities/hotel.entity";


@Entity('users')
export class User extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Column()
    @Exclude()
    password: string;

    @ApiProperty()
    @Column()
    civility: string;

    @ApiProperty()
    @Column()
    firstname: string;

    @ApiProperty()
    @Column()
    lastname: string;

    @ApiProperty()
    @Column()
    adress_line: string;

    @ApiProperty()
    @Column()
    zipCode: string;

    @ApiProperty()
    @Column()
    city: string;

    @ApiProperty()
    @Column()
    country: string;

    @ApiProperty()
    @Column()
    phone_number: string;

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    //@Exclude()
    role: UserRoleEnum;

    @ApiProperty({ type: () => Comment })
    @OneToMany(() => Comment, (comment) => comment.user, { eager: true })
    comments: Comment[]

    @ApiProperty({ type: () => Reservation })
    @OneToMany(() => Reservation, (reservation) => reservation.user, { eager: true })
    reservations: Reservation[]

    // relation M/M avec l'hôtel pour la pratique du système de like de l'appli
    @ApiProperty({ type: () => Hotel })
    @ManyToMany(() => Hotel, (hotel) => hotel.users)
    hotels: Hotel[]

}


