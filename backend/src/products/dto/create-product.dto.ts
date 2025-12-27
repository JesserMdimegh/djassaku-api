import { IsString, IsUrl, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product image URL or path' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Is product active', required: false })
  @IsOptional()
  @IsString()
  isActive?: boolean;

  @ApiProperty({ description: 'Product release date and time', required: false, example: '2024-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
