import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
} from "@nestjs/common";
import { RentalService } from "../rental/rental.service";
import { Rental } from "../rental/entities/rental.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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

interface AdminRentalData {
  dressId?: string;
  dressNombre?: string;
  foto?: string;
  desde?: string;
  hasta?: string;
  precioAlquiler?: number;
  talla?: string;
  color?: string;
  estado?:
    | "activo"
    | "pasado"
    | "cancelado"
    | "pendiente"
    | "confirmado"
    | "devuelto";
  clienteNombre?: string;
  clienteEmail?: string;
}

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@Controller("rentals")
export class RentalController {
  constructor(private rentalService: RentalService) {}

  @UseGuards(JwtAuthGuard)
  @Get("my-rentals")
  getMyRentals(@Request() req: RequestWithUser) {
    return this.rentalService.getMyRentals(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("active")
  getActiveRentals(@Request() req: RequestWithUser) {
    return this.rentalService.getActiveRentals(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("past")
  getPastRentals(@Request() req: RequestWithUser) {
    return this.rentalService.getPastRentals(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("pending")
  getPendingRentals(@Request() req: RequestWithUser) {
    return this.rentalService.getPendingRentals(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("admin/all-rentals")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAllRentalsAdmin(@Request() req: RequestWithUser) {
    return this.rentalService.getAllRentalsAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getRentalById(@Param("id") id: string, @Request() req: RequestWithUser) {
    return this.rentalService.getRentalById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createRental(
    @Body() rentalData: CreateRentalData,
    @Request() req: RequestWithUser,
  ) {
    return this.rentalService.createRental(req.user.userId, rentalData);
  }

  @UseGuards(JwtAuthGuard)
  @Post("create-payment-pending")
  createPaymentPending(
    @Body() rentalData: CreateRentalData,
    @Request() req: RequestWithUser,
  ) {
    return this.rentalService.createPaymentPending(req.user.userId, rentalData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  updateRental(
    @Param("id") id: string,
    @Body() updates: Partial<Rental>,
    @Request() req: RequestWithUser,
  ) {
    return this.rentalService.updateRental(id, req.user.userId, updates, false);
  }

  @UseGuards(JwtAuthGuard)
  @Put("admin/update/:id")
  updateRentalAdmin(
    @Param("id") id: string,
    @Body() updates: AdminRentalData,
    @Request() req: RequestWithUser,
  ) {
    if (updates.estado === "devuelto") updates.estado = "pasado";
    if (updates.estado === "confirmado") updates.estado = "activo";
    return this.rentalService.updateRental(
      id,
      req.user.userId,
      updates as Partial<Rental>,
      true,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  cancelRental(@Param("id") id: string, @Request() req: RequestWithUser) {
    const isAdmin = req.user.role === "admin";
    return this.rentalService.cancelRental(id, req.user.userId, isAdmin);
  }
}
