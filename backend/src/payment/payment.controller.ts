import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";

@Controller("api/payment") // ✅ RUTA COMPLETA
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    console.log("📍 POST /api/payment - Body recibido:", createPaymentDto);
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  async findAll() {
    console.log("📍 GET /api/payment");
    return this.paymentService.findAll();
  }

  @Get("with-user")
  async findAllWithUser() {
    console.log("📍 GET /api/payment/with-user");
    return this.paymentService.findAllWithUser();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    console.log("📍 GET /api/payment/:id");
    return this.paymentService.findById(id);
  }
}
