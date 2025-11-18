import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Rental } from "../../rental/entities/rental.entity";
import { Payment } from "../../payment/entities/payment.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column({ type: "enum", enum: ["user", "admin"], default: "user" })
  role: string;

  // ✅ NUEVOS CAMPOS CON nullable: true (TEMPORAL PARA MIGRACIÓN)
  @Column({ nullable: true })
  telefono: string; // 9 dígitos

  @Column({ nullable: true })
  dni: string; // 8 dígitos

  @Column({ nullable: true })
  fechaNacimiento: string; // ⬅️ CAMBIO: string en lugar de Date para flexibilidad

  @Column({ nullable: true })
  direccion: string;

  // ✅ CAMPOS EXISTENTES (SIN ROMPER)
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  name: string; // ✅ PARA COMPATIBILIDAD CON PAYMENT

  @Column({ nullable: true })
  phone: string; // ✅ PARA COMPATIBILIDAD CON PAYMENT

  @Column({ nullable: true })
  address: string; // ✅ PARA COMPATIBILIDAD CON PAYMENT

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ✅ RELACIONES
  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
