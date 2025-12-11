"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = exports.BookingService = void 0;
const database_1 = require("../config/database");
const booking_entity_1 = require("../models/booking.entity");
const show_entity_1 = require("../models/show.entity");
const typeorm_1 = require("typeorm");
const retry_1 = require("../utils/retry");
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 100;
const BOOKING_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes
class BookingService {
    async getBookingById(id) {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        const booking = await database_1.AppDataSource.getRepository(booking_entity_1.Booking).findOne({
            where: { id: numericId },
            relations: ['show']
        });
        if (!booking) {
            throw new Error('Booking not found');
        }
        return booking;
    }
    async createBooking(showId, customerName, customerEmail, numSeats) {
        return (0, retry_1.withRetry)(async () => {
            return database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
                // 1. Lock the show row to prevent concurrent updates
                const numericShowId = typeof showId === 'string' ? parseInt(showId, 10) : showId;
                const show = await transactionalEntityManager
                    .createQueryBuilder(show_entity_1.Show, 'show')
                    .setLock('pessimistic_write')
                    .where('show.id = :showId AND show.startTime > NOW()', { showId: numericShowId })
                    .getOne();
                if (!show) {
                    throw new Error('Show not found or has already started');
                }
                // 2. Check seat availability
                const seatUsage = await transactionalEntityManager
                    .createQueryBuilder(booking_entity_1.Booking, 'booking')
                    .select('COALESCE(SUM(booking.numSeats), 0)', 'used')
                    .where('booking.showId = :showId', { showId: numericShowId })
                    .andWhere('booking.status IN (:...statuses)', { statuses: [booking_entity_1.BookingStatus.PENDING, booking_entity_1.BookingStatus.CONFIRMED] })
                    .getRawOne();
                const usedSeats = Number(seatUsage?.used || 0);
                const availableSeats = show.totalSeats - usedSeats;
                if (availableSeats < numSeats) {
                    throw new Error(`Not enough seats available. Only ${availableSeats} seats left.`);
                }
                // 3. Check for existing pending bookings for this email
                const existingBooking = await transactionalEntityManager.findOne(booking_entity_1.Booking, {
                    where: {
                        customerEmail,
                        showId: numericShowId,
                        status: booking_entity_1.BookingStatus.PENDING,
                        createdAt: (0, typeorm_1.MoreThan)(new Date(Date.now() - 2 * 60 * 1000)) // Last 2 minutes
                    }
                });
                if (existingBooking) {
                    throw new Error('You already have a pending booking for this show');
                }
                // 4. Create the booking
                const booking = new booking_entity_1.Booking();
                booking.showId = numericShowId;
                booking.customerName = customerName;
                booking.customerEmail = customerEmail;
                booking.numSeats = numSeats;
                booking.status = booking_entity_1.BookingStatus.PENDING;
                booking.totalAmount = Number(show.price || 0) * numSeats;
                const savedBooking = await transactionalEntityManager.save(booking);
                // Set a timeout to expire the booking if not confirmed
                setTimeout(() => {
                    this.expireBooking(savedBooking.id).catch(error => {
                        console.error('Error expiring booking:', error);
                    });
                }, BOOKING_EXPIRY_MS);
                return savedBooking;
            });
        }, MAX_RETRIES, RETRY_DELAY_MS);
    }
    async cancelBooking(id) {
        return (0, retry_1.withRetry)(async () => {
            return database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
                const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
                const booking = await transactionalEntityManager.findOne(booking_entity_1.Booking, {
                    where: { id: numericId },
                    relations: ['show'],
                    lock: { mode: 'pessimistic_write' }
                });
                if (!booking) {
                    throw new Error('Booking not found');
                }
                if (booking.status !== booking_entity_1.BookingStatus.PENDING) {
                    throw new Error('Only pending bookings can be cancelled');
                }
                booking.status = booking_entity_1.BookingStatus.CANCELLED;
                return transactionalEntityManager.save(booking);
            });
        }, MAX_RETRIES, RETRY_DELAY_MS);
    }
    async confirmBooking(id) {
        return (0, retry_1.withRetry)(async () => {
            return database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
                try {
                    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
                    const booking = await transactionalEntityManager.findOne(booking_entity_1.Booking, {
                        where: { id: numericId },
                        relations: ['show'],
                        lock: { mode: 'pessimistic_write' }
                    });
                    if (!booking) {
                        throw new Error('Booking not found');
                    }
                    if (booking.status !== booking_entity_1.BookingStatus.PENDING) {
                        throw new Error('Only pending bookings can be confirmed');
                    }
                    // Double-check seat availability (pending + confirmed)
                    const seatUsage = await transactionalEntityManager
                        .createQueryBuilder(booking_entity_1.Booking, 'booking')
                        .select('COALESCE(SUM(booking.numSeats), 0)', 'used')
                        .where('booking.showId = :showId', { showId: booking.showId })
                        .andWhere('booking.status IN (:...statuses)', { statuses: [booking_entity_1.BookingStatus.PENDING, booking_entity_1.BookingStatus.CONFIRMED] })
                        .getRawOne();
                    const usedSeats = Number(seatUsage?.used || 0);
                    const availableSeats = booking.show.totalSeats - usedSeats;
                    if (availableSeats < booking.numSeats) {
                        throw new Error('Not enough seats available to confirm this booking');
                    }
                    booking.status = booking_entity_1.BookingStatus.CONFIRMED;
                    await transactionalEntityManager.save(booking);
                    return booking;
                }
                catch (error) {
                    console.error('Error confirming booking:', error);
                    throw error;
                }
            });
        }, MAX_RETRIES, RETRY_DELAY_MS);
    }
    async expireBooking(bookingId) {
        return (0, retry_1.withRetry)(async () => {
            return database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
                try {
                    const numericId = typeof bookingId === 'string' ? parseInt(bookingId, 10) : bookingId;
                    const booking = await transactionalEntityManager.findOne(booking_entity_1.Booking, {
                        where: { id: numericId },
                        relations: ['show'],
                        lock: { mode: 'pessimistic_write' }
                    });
                    if (!booking) {
                        console.log(`Booking ${bookingId} not found for expiration`);
                        return;
                    }
                    if (booking.status === booking_entity_1.BookingStatus.PENDING) {
                        booking.status = booking_entity_1.BookingStatus.EXPIRED;
                        await transactionalEntityManager.save(booking);
                        console.log(`Booking ${bookingId} expired successfully`);
                    }
                }
                catch (error) {
                    console.error('Error expiring booking:', error);
                    throw error;
                }
            });
        }, MAX_RETRIES, RETRY_DELAY_MS);
    }
    async getBookingsByShow(showId) {
        try {
            const numericShowId = typeof showId === 'string' ? parseInt(showId, 10) : showId;
            return database_1.AppDataSource.getRepository(booking_entity_1.Booking).find({
                where: {
                    showId: numericShowId,
                    status: booking_entity_1.BookingStatus.CONFIRMED
                },
                order: {
                    createdAt: 'DESC'
                },
                select: [
                    'id',
                    'customerName',
                    'numSeats',
                    'status',
                    'createdAt'
                ]
            });
        }
        catch (error) {
            console.error('Error getting bookings by show:', error);
            throw error;
        }
    }
}
exports.BookingService = BookingService;
exports.bookingService = new BookingService();
