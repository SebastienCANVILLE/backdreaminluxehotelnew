import { ApiProperty } from "@nestjs/swagger";
import { format } from "date-fns";
import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservations')
export class Reservation extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column(/* { nullable: true } */)
    reference: string;

    @ApiProperty()
    @Column({ type: 'date' })
    arrival_date: Date;

    @ApiProperty()
    @Column({ type: 'date' })
    departure_date: Date;

    @ApiProperty()
    @Column()
    totalPrice: number;

    @ApiProperty({ type: () => Room })
    @ManyToOne(() => Room, (room) => room.reservations, { onDelete: 'CASCADE' })
    room: Room;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
    user: User;
}
