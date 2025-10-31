import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/user.model.js';
import { Product } from '../src/models/product.model.js';

dotenv.config();
await connectDB();

const run = async () => {
  await User.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
  });

  const sampleProducts = [
    { name: 'Pamuklu Tişört', slug: 'pamuklu-tisort', price: 299.9, stock: 50, category: 'giyim', brand: 'TRB', description: 'Yumuşak pamuklu tişört' },
    { name: 'Oversize Hoodie', slug: 'oversize-hoodie', price: 799.9, stock: 30, category: 'giyim', brand: 'TRB', description: 'Sıcak ve rahat' },
    { name: 'Erkek Boxer 3\'lü', slug: 'erkek-boxer-3lu', price: 249.9, stock: 100, category: 'ic-giyim', brand: 'TRB', description: 'Rahat kesim' },
  ];

  await Product.insertMany(sampleProducts);

  console.log('Seed completed. Admin login:', admin.email, 'password: admin123');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
