import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  size: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product: Product;

  @Column('decimal', { precision: 10, scale: 2 })
  productPrice: number;

  @CreateDateColumn()
  createdAt: Date;
}
