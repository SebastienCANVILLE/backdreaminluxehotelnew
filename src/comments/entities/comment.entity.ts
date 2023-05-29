import { ApiProperty } from "@nestjs/swagger";
import { Hotel } from "../../hotels/entities/hotel.entity";
import { User } from "../../users/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comments')
export class Comment extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    clientName: string;

    @ApiProperty()
    @Column()
    commentary: string;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user: User;

    @ApiProperty({ type: () => Hotel })
    @ManyToOne(() => Hotel, (hotel) => hotel.comments, { onDelete: 'CASCADE' })
    hotel: Hotel;

}