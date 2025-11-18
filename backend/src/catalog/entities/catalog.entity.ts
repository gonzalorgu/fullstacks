import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Dress } from "../../dress/entities/dress.entity";

@Entity("Catalog")
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Dress, (dress) => dress.catalog)
  dresses: Dress[];
}
