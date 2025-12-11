"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const show_entity_1 = require("../models/show.entity");
const booking_entity_1 = require("../models/booking.entity");
const seat_entity_1 = require("../models/seat.entity");
const user_entity_1 = require("../models/user.entity");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || process.env.DB_NAME,
    entities: [show_entity_1.Show, booking_entity_1.Booking, seat_entity_1.Seat, user_entity_1.User],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: false // ❗ Your PostgreSQL server does NOT support SSL
});
// Optional: immediately test connection
(async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('✅ PostgreSQL connected successfully');
        await exports.AppDataSource.synchronize();
        console.log('✅ Database schema synchronized!');
    }
    catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error);
    }
})();
