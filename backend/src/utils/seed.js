import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { connectDB } from '../config/db.js';

const run = async () => {
  await connectDB();
  const args = process.argv.slice(2);
  if (args.includes('--admin')) {
    const email = 'admin@example.com';
    const existing = await User.findOne({ email });
    if (!existing) {
      await User.create({ name: 'Admin', email, password: await bcrypt.hash('Admin@12345', 10), role: 'admin' });
      console.log('Admin seeded');
    } else console.log('Admin exists');
  }
  if (args.includes('--products')) {
    await Product.deleteMany({});
    await Product.insertMany([
      { name: 'Basic Tee', slug: 'basic-tee', category: 'Apparel', price: 499, stock: 50, description: 'Cotton tee' },
      { name: 'Coffee Mug', slug: 'coffee-mug', category: 'Home', price: 299, stock: 100, description: 'Ceramic mug' }
    ]);
    console.log('Products seeded');
  }
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });