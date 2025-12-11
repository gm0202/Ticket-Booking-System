"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const database_1 = require("../config/database");
const booking_entity_1 = require("../models/booking.entity");
const booking_service_1 = require("../services/booking.service");
const create_booking_dto_1 = require("../dto/create-booking.dto");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const swagger_1 = require("@nestjs/swagger");
let BookingController = class BookingController {
    constructor() {
        this.router = require('express').Router();
        this.bookingRepository = database_1.AppDataSource.getRepository(booking_entity_1.Booking);
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/bookings', (0, validation_middleware_1.validateDto)(create_booking_dto_1.CreateBookingDto), this.createBooking.bind(this));
        this.router.get('/bookings/:id', this.getBookingById.bind(this));
        this.router.put('/bookings/:id/cancel', this.cancelBooking.bind(this));
        this.router.put('/bookings/:id/confirm', this.confirmBooking.bind(this));
        this.router.get('/bookings/show/:showId', this.getBookingsByShow.bind(this));
    }
    async createBooking(req, res, next) {
        try {
            // The validated DTO is already attached to req.body by the validation middleware
            const { showId, customerName, customerEmail, numSeats } = req.body;
            const booking = await booking_service_1.bookingService.createBooking(showId, customerName, customerEmail, numSeats);
            res.status(201).json({
                success: true,
                data: booking,
                message: 'Booking created. You have 2 minutes to confirm your booking.'
            });
        }
        catch (error) {
            const errorMessage = error?.message || 'An unknown error occurred';
            if (errorMessage.includes('not found') ||
                errorMessage.includes('already started') ||
                errorMessage.includes('Not enough seats') ||
                errorMessage.includes('already have a pending booking')) {
                return res.status(400).json({
                    success: false,
                    message: errorMessage
                });
            }
            next(error);
        }
    }
    async getBookingById(req, res, next) {
        try {
            const booking = await booking_service_1.bookingService.getBookingById(req.params.id);
            res.json({
                success: true,
                data: booking
            });
        }
        catch (error) {
            if (error?.message === 'Booking not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
    async cancelBooking(req, res, next) {
        try {
            const booking = await booking_service_1.bookingService.cancelBooking(req.params.id);
            res.json({
                success: true,
                data: booking,
                message: 'Booking cancelled successfully'
            });
        }
        catch (error) {
            if (error?.message === 'Booking not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error?.message === 'Only pending bookings can be cancelled') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
    async confirmBooking(req, res, next) {
        try {
            const booking = await booking_service_1.bookingService.confirmBooking(req.params.id);
            res.json({
                success: true,
                data: booking,
                message: 'Booking confirmed successfully'
            });
        }
        catch (error) {
            if (error?.message === 'Booking not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error?.message === 'Only pending bookings can be confirmed') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
    async getBookingsByShow(req, res, next) {
        try {
            const bookings = await this.bookingRepository.find({
                where: {
                    showId: parseInt(req.params.showId, 10),
                    status: booking_entity_1.BookingStatus.CONFIRMED // Only return confirmed bookings
                },
                order: {
                    createdAt: 'DESC'
                },
                relations: ['user'],
                select: {
                    id: true,
                    numSeats: true,
                    status: true,
                    createdAt: true,
                    user: {
                        name: true,
                        email: true
                    }
                }
            });
            res.json({
                success: true,
                data: bookings
            });
        }
        catch (error) {
            next(error);
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Show not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Not enough seats available' }),
    (0, swagger_1.ApiBody)({
        type: create_booking_dto_1.CreateBookingDto,
        description: 'Booking details',
        examples: {
            valid: {
                summary: 'A valid booking example',
                value: {
                    showId: '550e8400-e29b-41d4-a716-446655440000',
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    numSeats: 2
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Booking ID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Booking ID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot cancel booking' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a booking' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Booking ID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot confirm booking' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmBooking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings for a show' }),
    (0, swagger_1.ApiParam)({ name: 'showId', description: 'Show ID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bookings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingsByShow", null);
BookingController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [])
], BookingController);
exports.bookingController = new BookingController();
