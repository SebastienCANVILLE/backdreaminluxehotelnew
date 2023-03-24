import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "src/comments/entities/comment.entity";
import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('hotels')
export class Hotel extends BaseEntity {
    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name_hotel: string;

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
    phone_number: string;

    @ApiProperty({ type: () => Comment })
    @OneToMany(() => Comment, (comment) => comment.hotel, { eager: true })
    comments: Comment[]

    @ApiProperty({ type: () => Room })
    @OneToMany(() => Room, (room) => room.hotel, { eager: true })
    rooms: Room[]

    // relation M/M avec le user pour la pratique du système de like de l'appli
    @ApiProperty({ type: () => User })
    @ManyToMany(() => User, (user) => user.hotels, {
        cascade: true,
    })
    @JoinTable()
    users: User[]

}
