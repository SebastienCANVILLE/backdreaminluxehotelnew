import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {

    @ApiProperty()
    //@IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    number_room: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;
}


