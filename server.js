import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/config/db.js';
import productRoutes from './src/routes/product.routes.js';
import userRoutes from './src/routes/user.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import { notFound, errorHandler } from './src/middlewares/error.middleware.js';

dotenv.config();
const app = express();

// 📦 DATABASE
await connectDB();

// 🧩 MIDDLEWARES
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🌐 CORS AYARI (her yerden erişim açık)
app.use(
  cors({
    origin: '*', // test aşamasında herkese izin ver
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🚦 RATE LIMITER (istek sınırı)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 200, // aynı IP’den en fazla 200 istek
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 🧭 ROUTES
app.get('/api/health', (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ❌ HATA YAKALAYICILAR
app.use(notFound);
app.use(errorHandler);

// 🚀 SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT} - ${new Date().toLocaleString()}`)
);
