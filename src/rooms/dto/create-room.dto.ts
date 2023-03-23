import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name_room: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    number_room: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;
}


