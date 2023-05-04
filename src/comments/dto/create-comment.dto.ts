import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    commentary: string;

    @ApiProperty()
    @IsNumber()
    hotelId: number;

}
