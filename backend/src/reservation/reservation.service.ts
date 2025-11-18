import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reservation } from "./entities/reservation.entity";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { Rental } from "../rental/entities/rental.entity";
import { User } from "../auth/entities/user.entity";

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const rental = await this.rentalRepository.findOne({
      where: { id: createReservationDto.rentalId },
    });

    if (!rental) {
      throw new NotFoundException("Rental no encontrado");
    }

    const user = await this.userRepository.findOne({
      where: { id: createReservationDto.userId },
    });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const reservation = new Reservation();
    reservation.rental = rental;
    reservation.user = user;
    reservation.status = createReservationDto.status || "pendiente";
    reservation.fechaInicio = new Date(createReservationDto.fechaInicio);
    reservation.fechaFin = new Date(createReservationDto.fechaFin);
    reservation.precioTotal = createReservationDto.precioTotal;
    reservation.notas = createReservationDto.notas || null;
    reservation.estadoPago = createReservationDto.estadoPago || "sin-pago";

    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ["rental", "user"],
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ["rental", "user"],
    });

    if (!reservation) {
      throw new NotFoundException("Reservation no encontrada");
    }

    return reservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (updateReservationDto.status) {
      reservation.status = updateReservationDto.status;
    }

    if (updateReservationDto.fechaInicio) {
      reservation.fechaInicio = new Date(updateReservationDto.fechaInicio);
    }

    if (updateReservationDto.fechaFin) {
      reservation.fechaFin = new Date(updateReservationDto.fechaFin);
    }

    if (updateReservationDto.precioTotal !== undefined) {
      reservation.precioTotal = updateReservationDto.precioTotal;
    }

    if (updateReservationDto.notas !== undefined) {
      reservation.notas = updateReservationDto.notas || null;
    }

    if (updateReservationDto.estadoPago) {
      reservation.estadoPago = updateReservationDto.estadoPago;
    }

    return this.reservationRepository.save(reservation);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }
}
