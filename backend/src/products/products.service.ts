import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log('Received DTO:', createProductDto);
    console.log('imageUrl value:', createProductDto.imageUrl);
    console.log('imageUrl type:', typeof createProductDto.imageUrl);
    
    // Validate imageUrl if provided
    if (createProductDto.imageUrl) {
      try {
        // Check if it's a relative path (starts with /uploads/)
        if (createProductDto.imageUrl.startsWith('/uploads/')) {
          console.log('Relative path validation passed');
        } else {
          // Try to validate as full URL
          new URL(createProductDto.imageUrl);
          console.log('Full URL validation passed');
        }
      } catch {
        console.log('URL validation failed');
        throw new BadRequestException('imageUrl must be a valid URL address or relative path starting with /uploads/');
      }
    }
    
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async findPreviousProducts(limit: number = 10): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isActive: true },
      order: { orderCount: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    // Validate imageUrl if provided
    if (updateProductDto.imageUrl) {
      try {
        // Check if it's a relative path (starts with /uploads/)
        if (updateProductDto.imageUrl.startsWith('/uploads/')) {
          console.log('Relative path validation passed');
        } else {
          // Try to validate as full URL
          new URL(updateProductDto.imageUrl);
          console.log('Full URL validation passed');
        }
      } catch {
        console.log('URL validation failed');
        throw new BadRequestException('imageUrl must be a valid URL address or relative path starting with /uploads/');
      }
    }
    
    await this.productsRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.update(id, { isActive: false });
  }

  async incrementOrderCount(id: number): Promise<void> {
    await this.productsRepository.increment({ id }, 'orderCount', 1);
  }
}
