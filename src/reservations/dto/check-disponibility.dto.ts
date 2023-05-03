import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateReservationDto } from "./create-reservation.dto";

export class CheckDisponibilityDto extends PartialType(CreateReservationDto) {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    arrival_date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    departure_date: Date;

    @ApiProperty()
    @IsNumber()
    roomId: number

}