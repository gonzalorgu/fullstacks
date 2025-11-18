import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Rental } from "../../rental/entities/rental.entity";
import { User } from "../../auth/entities/user.entity";

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Rental, (rental: Rental) => rental.reservations, {
    onDelete: "CASCADE",
  })
  rental: Rental;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: "pendiente" })
  status: "pendiente" | "confirmada" | "cancelada" | "completada";

  @Column("date")
  fechaInicio: Date;

  @Column("date")
  fechaFin: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  precioTotal: number;

  @Column("text", { nullable: true }) // ✨ CAMBIAR: agregar 'text'
  notas: string | null;

  @Column({ default: "sin-pago" })
  estadoPago: "sin-pago" | "pagado" | "reembolsado";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
