import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../auth/entities/user.entity";

export type TipoMantenimiento =
  | "lavado"
  | "reparacion"
  | "limpieza_profunda"
  | "ajuste";
export type EstadoMantenimiento =
  | "pendiente"
  | "en_proceso"
  | "completado"
  | "cancelado";

@Entity("maintenance")
export class Maintenance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  dressId: string;

  @Column()
  dressNombre: string;

  @Column({ type: "varchar", nullable: true })
  foto: string | null;

  // ------- CAMPO REQUERIDO -------
  @Column({ type: "integer", default: 1 })
  cantidad: number;
  // -------------------------------

  @Column({
    type: "enum",
    enum: ["lavado", "reparacion", "limpieza_profunda", "ajuste"],
  })
  tipo: TipoMantenimiento;

  @Column({
    type: "enum",
    enum: ["pendiente", "en_proceso", "completado", "cancelado"],
    default: "pendiente",
  })
  estado: EstadoMantenimiento;

  @Column({ type: "text", nullable: true })
  observaciones: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  costo: number | null;

  @Column({ type: "timestamp", nullable: true })
  fechaInicio: Date | null;

  @Column({ type: "timestamp", nullable: true })
  fechaFin: Date | null;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
