import { ApiProperty } from "@nestjs/swagger";
import { Hotel } from "src/hotels/entities/hotel.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ nullable: true })
    photo: string;

    @ApiProperty()
    @Column({ nullable: true })
    name: string;

    @ApiProperty()
    @Column()
    number_room: string;

    @ApiProperty()
    @Column()
    price: number;

    @ApiProperty({ type: () => Reservation })
    @OneToMany(() => Reservation, (reservation) => reservation.room, { eager: true })
    reservations: Reservation[]

    @ApiProperty({ type: () => Hotel })
    @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: 'CASCADE' })
    hotel: Hotel;

}
