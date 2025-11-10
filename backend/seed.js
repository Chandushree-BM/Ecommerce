import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import Order from './src/models/Order.js';

// Sample products data
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 79.99,
    category: 'Electronics',
    stock: 50,
    weight: 0.25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: 'Smart Watch Series 5',
    slug: 'smart-watch-series-5',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS. Stay connected and healthy.',
    price: 299.99,
    category: 'Electronics',
    stock: 30,
    weight: 0.05,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    rating: 4.7,
    numReviews: 256,
  },
  {
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors. Perfect for casual wear.',
    price: 24.99,
    category: 'Clothing',
    stock: 100,
    weight: 0.2,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    rating: 4.3,
    numReviews: 89,
  },
  {
    name: 'Leather Laptop Bag',
    slug: 'leather-laptop-bag',
    description: 'Professional leather laptop bag with multiple compartments. Fits up to 15.6" laptops.',
    price: 89.99,
    category: 'Other',
    stock: 25,
    weight: 1.2,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    rating: 4.6,
    numReviews: 74,
  },
  {
    name: 'Yoga Mat Pro',
    slug: 'yoga-mat-pro',
    description: 'Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and floor exercises.',
    price: 34.99,
    category: 'Sports',
    stock: 60,
    weight: 1.5,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    rating: 4.4,
    numReviews: 112,
  },
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.',
    price: 19.99,
    category: 'Sports',
    stock: 80,
    weight: 0.4,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
    rating: 4.8,
    numReviews: 203,
  },
  {
    name: 'The Art of Programming',
    slug: 'art-of-programming-book',
    description: 'Comprehensive guide to modern programming practices and design patterns.',
    price: 45.99,
    category: 'Books',
    stock: 40,
    weight: 0.8,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    rating: 4.9,
    numReviews: 167,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    slug: 'ceramic-coffee-mug-set',
    description: 'Set of 4 elegant ceramic coffee mugs. Microwave and dishwasher safe.',
    price: 29.99,
    category: 'Home & Kitchen',
    stock: 45,
    weight: 1.8,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500'],
    rating: 4.2,
    numReviews: 56,
  },
  {
    name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
    price: 39.99,
    category: 'Home & Kitchen',
    stock: 35,
    weight: 0.6,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
    rating: 4.5,
    numReviews: 91,
  },
  {
    name: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: 'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.',
    price: 59.99,
    category: 'Electronics',
    stock: 55,
    weight: 0.15,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
    rating: 4.6,
    numReviews: 142,
  },
  {
    name: 'Organic Face Cream',
    slug: 'organic-face-cream',
    description: 'Natural organic face cream with vitamin E and aloe vera. Suitable for all skin types.',
    price: 27.99,
    category: 'Beauty',
    stock: 70,
    weight: 0.1,
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
    rating: 4.7,
    numReviews: 189,
  },
  {
    name: 'Building Blocks Set',
    slug: 'building-blocks-set',
    description: 'Creative building blocks set with 500 pieces. Great for kids aged 5 and up.',
    price: 34.99,
    category: 'Toys',
    stock: 42,
    weight: 2.0,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'],
    rating: 4.8,
    numReviews: 234,
  },
];

// Admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'Admin@12345',
  role: 'admin',
};

// Sample regular user
const regularUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'User@12345',
  role: 'user',
  shippingAddresses: [{
    fullName: 'John Doe',
    phone: '+1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isDefault: true,
  }],
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create users
    console.log('Creating users...');
    const admin = await User.create(adminUser);
    const user = await User.create(regularUser);
    console.log('✓ Users created');

    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✓ ${createdProducts.length} products created`);

    // Create sample orders
    console.log('Creating sample orders...');
    const sampleOrders = [
      {
        orderId: 'ORD-SAMPLE-001',
        user: user._id,
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            quantity: 1,
            price: createdProducts[0].price,
            image: createdProducts[0].images[0],
          },
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            quantity: 1,
            price: createdProducts[1].price,
            image: createdProducts[1].images[0],
          },
        ],
        shippingAddress: user.shippingAddresses[0],
        paymentMethod: 'Cash on Delivery',
        subtotal: createdProducts[0].price + createdProducts[1].price,
        shippingCost: 0,
        tax: (createdProducts[0].price + createdProducts[1].price) * 0.18,
        total: (createdProducts[0].price + createdProducts[1].price) * 1.18,
        status: 'Delivered',
      },
      {
        orderId: 'ORD-SAMPLE-002',
        user: user._id,
        items: [
          {
            product: createdProducts[2]._id,
            name: createdProducts[2].name,
            quantity: 2,
            price: createdProducts[2].price,
            image: createdProducts[2].images[0],
          },
        ],
        shippingAddress: user.shippingAddresses[0],
        paymentMethod: 'Cash on Delivery',
        subtotal: createdProducts[2].price * 2,
        shippingCost: 50,
        tax: (createdProducts[2].price * 2) * 0.18,
        total: (createdProducts[2].price * 2) * 1.18 + 50,
        status: 'Processing',
      },
      {
        orderId: 'ORD-SAMPLE-003',
        user: user._id,
        items: [
          {
            product: createdProducts[5]._id,
            name: createdProducts[5].name,
            quantity: 3,
            price: createdProducts[5].price,
            image: createdProducts[5].images[0],
          },
        ],
        shippingAddress: user.shippingAddresses[0],
        paymentMethod: 'Cash on Delivery',
        subtotal: createdProducts[5].price * 3,
        shippingCost: 50,
        tax: (createdProducts[5].price * 3) * 0.18,
        total: (createdProducts[5].price * 3) * 1.18 + 50,
        status: 'Pending',
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`✓ ${sampleOrders.length} sample orders created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: Admin@12345');
    console.log('\nUser:');
    console.log('  Email: john@example.com');
    console.log('  Password: User@12345');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
