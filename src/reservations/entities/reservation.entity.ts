import { ApiProperty } from "@nestjs/swagger";
import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservations')
export class Reservation extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    /* @ApiProperty()
    @Column()
    reference: string; */

    @ApiProperty()
    @Column()
    arrival_date: Date;

    @ApiProperty()
    @Column()
    departure_date: Date;


    @ApiProperty({ type: () => Room })
    @ManyToOne(() => Room, (room) => room.reservations, {onDelete: 'CASCADE' })
    room: Room

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.reservations, {onDelete: 'CASCADE' })
    user: User;
}
