import { Repository } from "typeorm";
import { Reservation } from "./entities/reservation.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { Rental } from "../rental/entities/rental.entity";
import { User } from "../auth/entities/user.entity";
export declare class ReservationService {
    private reservationRepository;
    private rentalRepository;
    private userRepository;
    constructor(reservationRepository: Repository<Reservation>, rentalRepository: Repository<Rental>, userRepository: Repository<User>);
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
    findOne(id: string): Promise<Reservation>;
    update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation>;
    remove(id: string): Promise<void>;
}
