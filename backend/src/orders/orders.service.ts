import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const product = await this.productsService.findOne(createOrderDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const order = this.ordersRepository.create({
      ...createOrderDto,
      product,
      productPrice: product.price,
    });

    const savedOrder = await this.ordersRepository.save(order);
    
    // Increment product order count
    await this.productsService.incrementOrderCount(createOrderDto.productId);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    await this.ordersRepository.update(id, { status });
    return this.findOne(id);
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }
}
