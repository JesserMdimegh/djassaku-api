import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productsService = app.get(ProductsService);
  const authService = app.get(AuthService);

  // Create default admin user
  await authService.createDefaultAdmin();

  // Create sample products
  const sampleProducts = [
    {
      name: 'Premium Wireless Headphones',
      description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and superior comfort for all-day wear.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      price: 299.99,
    },
    {
      name: 'Smart Watch Pro',
      description: 'Stay connected and track your fitness goals with our advanced smartwatch. Features include heart rate monitoring, GPS tracking, and 5-day battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop',
      price: 449.99,
    },
    {
      name: 'Minimalist Leather Backpack',
      description: 'Crafted from genuine leather, this backpack combines style and functionality. Perfect for work, travel, or everyday use with multiple compartments.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      price: 189.99,
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Powerful 360° sound in a compact design. Waterproof, shockproof, and with 20-hour battery life for music anywhere, anytime.',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
      price: 79.99,
    },
    {
      name: 'Eco-Friendly Water Bottle',
      description: 'Stay hydrated sustainably with our insulated stainless steel bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
      price: 34.99,
    },
  ];

  for (const productData of sampleProducts) {
    await productsService.create(productData);
  }

  console.log('Database seeded successfully!');
  await app.close();
}

seed().catch(console.error);
