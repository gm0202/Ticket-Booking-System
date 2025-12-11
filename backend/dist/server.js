"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
const show_controller_1 = require("./controllers/show.controller");
const booking_controller_1 = require("./controllers/booking.controller");
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Initialize the app with the controllers
const app = new app_1.App([show_controller_1.showController, booking_controller_1.bookingController], PORT);
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
