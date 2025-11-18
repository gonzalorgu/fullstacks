import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { RentalService } from "../rental/rental.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateTransactionDto } from "./dto/createtransactionDto";

interface RequestWithUser extends Request {
  user: {
    id: number;
    userId: number;
    email: string;
    role: string;
  };
}

@Controller("transactions")
export class TransactionsController {
  constructor(private rentalService: RentalService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create")
  createTransaction(
    @Body() data: CreateTransactionDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.id || req.user.userId;

    if (data.tipo === "alquiler") {
      if (!data.desde || !data.hasta) {
        throw new Error("Para alquiler, desde y hasta son requeridos");
      }

      const rentalPayload = {
        dressId: data.dressId,
        dressNombre: data.dressNombre,
        foto: data.foto,
        desde: data.desde,
        hasta: data.hasta,
        precioAlquiler: data.precio,
        talla: data.talla,
        color: data.color,
        clienteNombre: data.clienteNombre,
        clienteEmail: data.clienteEmail,
      };

      return this.rentalService.createRental(userId, rentalPayload);
    } else {
      throw new Error("Tipo de transacción inválido");
    }
  }
}
