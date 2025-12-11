import 'reflect-metadata';
import { App } from './app';
import { showController } from './controllers/show.controller';
import { bookingController } from './controllers/booking.controller';
import { authController } from './controllers/auth.controller';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Initialize the app with the controllers
const app = new App(
    [showController, bookingController, authController],
    PORT
);

// Start the server
app.listen();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});