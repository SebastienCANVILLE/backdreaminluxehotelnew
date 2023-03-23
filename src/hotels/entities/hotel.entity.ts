import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
