import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name_room: string;

    @ApiProperty()
    @Column()
    number_room: string;

    @ApiProperty()
    @Column()
    price: number;

}
