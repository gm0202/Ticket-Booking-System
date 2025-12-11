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
exports.Show = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const seat_entity_1 = require("./seat.entity");
const booking_entity_2 = require("./booking.entity");
let Show = class Show {
    constructor() {
        this.description = null;
    }
    get availableSeats() {
        return this.totalSeats - (this.bookings?.reduce((sum, booking) => sum + (booking.status === booking_entity_2.BookingStatus.CONFIRMED ? booking.numSeats : 0), 0) || 0);
    }
    canBookSeats(seats) {
        return this.availableSeats >= seats && this.startTime > new Date();
    }
    validateShowTimings() {
        if (this.startTime >= this.endTime) {
            throw new Error('End time must be after start time');
        }
    }
    // Method to check if a seat is available
    isSeatAvailable(seatNumber) {
        return !this.seats.some(seat => seat.seatNumber === seatNumber && seat.isBooked);
    }
    // Method to get available seats
    getAvailableSeats() {
        return this.seats.filter(seat => !seat.isBooked);
    }
};
exports.Show = Show;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Show.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Show.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", Object)
], Show.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Show.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Show.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_seats' }),
    __metadata("design:type", Number)
], Show.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Show.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, booking => booking.show),
    __metadata("design:type", Array)
], Show.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seat_entity_1.Seat, seat => seat.show),
    __metadata("design:type", Array)
], Show.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Show.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Show.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Show.prototype, "validateShowTimings", null);
exports.Show = Show = __decorate([
    (0, typeorm_1.Entity)('shows')
], Show);
