"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../models/user.entity");
const show_entity_1 = require("../models/show.entity");
const booking_entity_1 = require("../models/booking.entity");
const seat_entity_1 = require("../models/seat.entity");
// Load environment variables
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ticket_booking',
    entities: [user_entity_1.User, show_entity_1.Show, booking_entity_1.Booking, seat_entity_1.Seat],
    synchronize: false,
    logging: true,
    migrations: [`${__dirname}/migrations/*.ts`],
    migrationsTableName: 'migrations',
});
async function runMigrations() {
    try {
        console.log('Initializing data source...');
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
        console.log('Running migrations...');
        await AppDataSource.runMigrations();
        console.log('Migrations have been run successfully!');
    }
    catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
    finally {
        await AppDataSource.destroy();
    }
}
runMigrations();
