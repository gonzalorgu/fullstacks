import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { RentalModule } from "../rental/rental.module";

@Module({
  imports: [RentalModule],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
