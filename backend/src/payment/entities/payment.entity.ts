import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../auth/entities/user.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column("timestamp", { nullable: true })
  payment_date: string;

  @Column("varchar", { nullable: true })
  payment_method: string;

  @Column("varchar", { nullable: true })
  rental_id: string;

  @Column("integer", { nullable: true })
  user_id: number;

  @Column("varchar", { nullable: true })
  reference: string;

  @Column("varchar", { default: "Pendiente", nullable: true })
  status: string;

  @Column("text", { nullable: true })
  receipt_image: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
