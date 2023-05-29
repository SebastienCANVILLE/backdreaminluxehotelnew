import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from '../src/reservations/reservations.service';
import { CreateReservationDto } from '../src/reservations/dto/create-reservation.dto';
import { User } from '../src/users/entities/user.entity';
import { RoomsModule } from '../src/rooms/rooms.module';
import { RoomsService } from '../src/rooms/rooms.service';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { Room } from '../src/rooms/entities/room.entity'; //desangagement pour test
//import { Room } from '../rooms/entities/room.entity'; //essai pour régler

describe('ReservationsService', () => {
    let reservationsService: ReservationsService;

    beforeEach(async () => {
        const moduleRef : TestingModule =  await Test.createTestingModule({
            imports: [RoomsModule,UsersModule], // essai pour régler
            providers: [ReservationsService,RoomsService,UsersService],
        }).compile();

        reservationsService = moduleRef.get<ReservationsService>(ReservationsService);
    });

    describe('createReservation', () => {
        it('doit créer un réservation complète', async () => {
            // Création des données de test
            const createReservationDto: CreateReservationDto = {
                reference: 'DREAMINLUXEHOTEL3331',
                arrival_date: new Date('2023-05-25'),
                departure_date: new Date('2023-05-27'),
                roomId: 1,
                totalPrice: 2000

            };

            const userReservation: User = new User();
            const roomReservation: Room = new Room();

            // Appel de la méthode createReservation
            const result = await reservationsService.createReservation(
                createReservationDto,
                userReservation,
                roomReservation,
            );

            // Vérification des valeurs de la réservation créée
            expect(result).toBeDefined();
            expect(result.reference).toBe(createReservationDto.reference);
            expect(result.arrival_date).toBe(createReservationDto.arrival_date);
            expect(result.departure_date).toBe(createReservationDto.departure_date);
            expect(result.room).toBe(createReservationDto.roomId);
            expect(result.totalPrice).toBe(createReservationDto.totalPrice);
            expect(result.user).toBe(userReservation);
            expect(result.room).toBe(roomReservation);

        });


    });
});