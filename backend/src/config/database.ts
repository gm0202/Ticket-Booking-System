import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Show } from '../models/show.entity';
import { Booking } from '../models/booking.entity';
import { Seat } from '../models/seat.entity';
import { User } from '../models/user.entity';

config();

const isProduction = !!process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
    type: 'postgres',
    ...(isProduction ? {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    } : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || process.env.DB_NAME || 'ticket_booking',
        ssl: false
    }),
    entities: [Show, Booking, Seat, User],
    synchronize: true, // Auto-create tables for demo
    logging: !isProduction
});

// Optional: immediately test connection
(async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ PostgreSQL connected successfully');

        await AppDataSource.synchronize();
        console.log('✅ Database schema synchronized!');
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error);
    }
})();
