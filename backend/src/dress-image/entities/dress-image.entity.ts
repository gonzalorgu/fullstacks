import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Dress } from "../../dress/entities/dress.entity";

@Entity("DressImage")
export class DressImage {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Dress, (dress) => dress.images)
  @JoinColumn({ name: "dress_id" })
  dress: Dress;

  @Column()
  dress_id: number;

  @Column({ type: "varchar", length: 500 })
  image_url: string;

  @Column({ type: "boolean", default: false })
  is_main: boolean;

  @CreateDateColumn()
  uploaded_at: Date;
}
