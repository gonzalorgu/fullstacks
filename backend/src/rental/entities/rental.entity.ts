import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";

@Entity("rentals")
export class Rental {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user: User) => user.rentals, { onDelete: "CASCADE" })
  user: User;

  @Column()
  dressId: string;

  @Column()
  dressNombre: string;

  @Column("varchar", { nullable: true })
  foto: string | null;

  @Column("date")
  desde: Date;

  @Column("date")
  hasta: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  precioAlquiler: number;

  @Column("varchar", { nullable: true })
  talla: string | null;

  @Column("varchar", { nullable: true })
  color: string | null;

  @Column("varchar", { nullable: true })
  clienteNombre: string | null;

  @Column("varchar", { nullable: true })
  clienteEmail: string | null;

  @Column({
    type: "varchar",
    length: 20,
    default: "activo",
    comment: "Estados: activo, pasado, cancelado, pendiente",
  })
  estado: "activo" | "pasado" | "cancelado" | "pendiente";

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => Reservation,
    (reservation: Reservation) => reservation.rental,
    { cascade: true },
  )
  reservations: Reservation[];
}
