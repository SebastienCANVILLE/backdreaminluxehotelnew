import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservations')
export class Reservation extends BaseEntity {
    
    @ApiProperty()
    @Column()
    reference: string;

    @ApiProperty()
    @Column()
    arrival_date: Date;

    @ApiProperty()
    @Column()
    departure_date: Date;

}
