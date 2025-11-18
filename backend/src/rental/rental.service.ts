import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rental } from "../rental/entities/rental.entity";
import { User } from "../auth/entities/user.entity";
import { DressService } from "../dress/dress.service";
import { NotificationsGateway } from "../notifications/notifications.gateway";

interface CreateRentalData {
  dressId: string;
  dressNombre: string;
  foto?: string;
  desde: string;
  hasta: string;
  precioAlquiler: number;
  talla?: string;
  color?: string;
  estado?: "activo" | "pasado" | "cancelado" | "pendiente";
  clienteNombre?: string;
  clienteEmail?: string;
}

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dressService: DressService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async getMyRentals(userId: number): Promise<Rental[]> {
    // ... igual que antes ...
    const rentals = await this.rentalRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
      order: { desde: "DESC" },
    });
    return rentals;
  }

  async getActiveRentals(userId: number): Promise<Rental[]> {
    // ... igual que antes ...
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.rentalRepository
      .createQueryBuilder("rental")
      .leftJoinAndSelect("rental.user", "user")
      .where("rental.userId = :userId", { userId })
      .andWhere("rental.hasta >= :today", { today })
      .orderBy("rental.desde", "DESC")
      .getMany();
  }

  async getPastRentals(userId: number): Promise<Rental[]> {
    // ... igual que antes ...
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.rentalRepository
      .createQueryBuilder("rental")
      .leftJoinAndSelect("rental.user", "user")
      .where("rental.userId = :userId", { userId })
      .andWhere("rental.hasta < :today", { today })
      .orderBy("rental.desde", "DESC")
      .getMany();
  }

  async getPendingRentals(userId: number): Promise<Rental[]> {
    // ... igual que antes ...
    return this.rentalRepository
      .createQueryBuilder("rental")
      .leftJoinAndSelect("rental.user", "user")
      .where("rental.userId = :userId", { userId })
      .andWhere("rental.estado = :estado", { estado: "pendiente" })
      .orderBy("rental.desde", "DESC")
      .getMany();
  }

  async getRentalById(id: string, userId: number): Promise<Rental> {
    // ... igual que antes ...
    const rental = await this.rentalRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["user"],
    });

    if (!rental) throw new NotFoundException("Alquiler no encontrado");
    return rental;
  }

  async createRental(
    userId: number,
    rentalData: CreateRentalData,
  ): Promise<Rental> {
    // ... igual que antes ...
    if (!rentalData) {
      throw new Error("❌ No se recibieron datos");
    }

    if (!rentalData.dressId) {
      throw new Error("❌ dressId es requerido");
    }

    const dress = await this.dressService.findOne(+rentalData.dressId);

    if (!dress.isActive || dress.quantity <= 0) {
      throw new BadRequestException(
        `Vestido "${dress.name}" no disponible. Stock: ${dress.quantity}`,
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const rental = new Rental();
    rental.dressId = rentalData.dressId;
    rental.dressNombre = rentalData.dressNombre;
    rental.foto = rentalData.foto || null;
    rental.desde = new Date(rentalData.desde);
    rental.hasta = new Date(rentalData.hasta);
    rental.precioAlquiler = rentalData.precioAlquiler;
    rental.talla = rentalData.talla || null;
    rental.color = rentalData.color || null;
    rental.estado = rentalData.estado || "activo";
    rental.clienteNombre = rentalData.clienteNombre || null;
    rental.clienteEmail = rentalData.clienteEmail || null;
    rental.user = user;

    const savedRental = await this.rentalRepository.save(rental);

    await this.dressService.decreaseStock(+rentalData.dressId, 1);

    const rentalWithUser = await this.rentalRepository.findOne({
      where: { id: savedRental.id },
      relations: ["user"],
    });

    if (!rentalWithUser)
      throw new NotFoundException("Error al crear el alquiler");

    this.notificationsGateway.notifyAdmins({
      titulo: "Nuevo pedido",
      mensaje: `Pedido de ${rentalWithUser.clienteNombre || rentalWithUser.user?.nombre || "Cliente"}`,
      fecha: new Date(),
      datos: {
        id: rentalWithUser.id,
        dress: rentalWithUser.dressNombre,
        desde: rentalWithUser.desde,
        hasta: rentalWithUser.hasta,
        cliente: rentalWithUser.clienteNombre,
        email: rentalWithUser.clienteEmail,
      },
    });

    return rentalWithUser;
  }

  async createPaymentPending(
    userId: number,
    rentalData: CreateRentalData,
  ): Promise<Rental> {
    if (!rentalData) {
      throw new Error("❌ No se recibieron datos");
    }

    if (!rentalData.dressId) {
      throw new Error("❌ dressId es requerido");
    }

    const dress = await this.dressService.findOne(+rentalData.dressId);

    if (!dress.isActive || dress.quantity <= 0) {
      throw new BadRequestException(
        `Vestido "${dress.name}" no disponible. Stock: ${dress.quantity}`,
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const rental = new Rental();
    rental.dressId = rentalData.dressId;
    rental.dressNombre = rentalData.dressNombre;
    rental.foto = rentalData.foto || null;
    rental.desde = new Date(rentalData.desde);
    rental.hasta = new Date(rentalData.hasta);
    rental.precioAlquiler = rentalData.precioAlquiler;
    rental.talla = rentalData.talla || null;
    rental.color = rentalData.color || null;
    rental.estado = rentalData.estado || "pendiente";
    rental.clienteNombre = rentalData.clienteNombre || user.nombre || "Cliente";
    rental.clienteEmail = rentalData.clienteEmail || user.email;
    rental.user = user;

    const savedRental = await this.rentalRepository.save(rental);

    await this.dressService.decreaseStock(+rentalData.dressId, 1);

    const rentalWithUser = await this.rentalRepository.findOne({
      where: { id: savedRental.id },
      relations: ["user"],
    });

    if (!rentalWithUser)
      throw new NotFoundException("Error al crear el alquiler");

    // CORRECCIÓN aquí: casteo seguro a Date
    const desdeDate = rentalWithUser.desde
      ? new Date(rentalWithUser.desde)
      : null;
    const hastaDate = rentalWithUser.hasta
      ? new Date(rentalWithUser.hasta)
      : null;

    try {
      this.notificationsGateway.notifyAdmins({
        titulo: "Nueva reserva pendiente",
        mensaje:
          `Reserva de ${rentalWithUser.dressNombre} para ` +
          `${rentalWithUser.clienteNombre || rentalWithUser.user?.nombre || "Cliente"} ` +
          `desde ${desdeDate ? desdeDate.toLocaleDateString() : "(sin fecha)"} ` +
          `hasta ${hastaDate ? hastaDate.toLocaleDateString() : "(sin fecha)"}`,
        fecha: new Date(),
        datos: {
          id: rentalWithUser.id,
          dress: rentalWithUser.dressNombre,
          desde: rentalWithUser.desde,
          hasta: rentalWithUser.hasta,
          cliente: rentalWithUser.clienteNombre,
          email: rentalWithUser.clienteEmail,
          estado: rentalWithUser.estado,
        },
      });
    } catch (err) {
      console.error("❌ Error en NOTIFICACIÓN:", err);
    }

    return rentalWithUser;
  }

  async updateRental(
    id: string,
    userId: number,
    updates: Partial<Rental>,
    isAdmin: boolean = false,
  ): Promise<Rental> {
    let rental: Rental | null = null;
    if (isAdmin) {
      rental = await this.rentalRepository.findOne({
        where: { id },
        relations: ["user"],
      });
      if (!rental) throw new NotFoundException("Alquiler no encontrado");
    } else {
      rental = await this.getRentalById(id, userId);
    }

    if (updates.estado === "pasado" && rental.estado !== "pasado") {
      await this.dressService.increaseStock(+rental.dressId, 1);
    }

    Object.assign(rental, updates);
    const updatedRental = await this.rentalRepository.save(rental);

    const rentalWithUser = await this.rentalRepository.findOne({
      where: { id: updatedRental.id },
      relations: ["user"],
    });

    if (!rentalWithUser)
      throw new NotFoundException("Error al actualizar el alquiler");

    return rentalWithUser;
  }

  async cancelRental(
    id: string,
    userId: number,
    isAdmin: boolean = false,
  ): Promise<{ message: string }> {
    let rental: Rental | null = null;

    if (isAdmin) {
      rental = await this.rentalRepository.findOne({
        where: { id },
        relations: ["user"],
      });
    } else {
      rental = await this.getRentalById(id, userId);
    }

    if (!rental) throw new NotFoundException("Alquiler no encontrado");

    await this.dressService.increaseStock(+rental.dressId, 1);

    await this.rentalRepository.remove(rental);

    return { message: "Alquiler eliminado exitosamente" };
  }

  async getAllRentalsAdmin(): Promise<Rental[]> {
    const rentals = await this.rentalRepository.find({
      relations: ["user"],
      order: { desde: "DESC" },
    });
    return rentals;
  }
}
