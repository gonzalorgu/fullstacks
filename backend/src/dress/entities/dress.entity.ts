import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Catalog } from "../../catalog/entities/catalog.entity";
import { DressImage } from "../../dress-image/entities/dress-image.entity";

@Entity("Dress")
export class Dress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", array: true, default: "{}", nullable: true })
  size: string[];

  @Column({ type: "varchar", length: 50, nullable: true })
  color: string;

  @Column({
    type: "text",
    array: true,
    default: "{}",
    nullable: true,
  })
  colors: string[];

  @Column({ type: "varchar", length: 50, default: "available" })
  status: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  rental_price: number;

  @Column({ type: "text", nullable: true })
  imagen: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "integer", default: 1 })
  quantity: number;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @ManyToOne(() => Catalog, { nullable: true })
  @JoinColumn({ name: "catalog_id" })
  catalog: Catalog;

  @Column({ nullable: true })
  catalog_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @OneToMany(() => DressImage, (image) => image.dress)
  images: DressImage[];
}
