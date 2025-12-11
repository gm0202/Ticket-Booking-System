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
exports.Booking = exports.BookingStatus = void 0;
const typeorm_1 = require("typeorm");
const show_entity_1 = require("./show.entity");
const user_entity_1 = require("./user.entity");
const seat_entity_1 = require("./seat.entity");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["FAILED"] = "failed";
    BookingStatus["EXPIRED"] = "expired";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
let Booking = class Booking {
    constructor() {
        this.user = null;
        this.userId = null;
        this.status = BookingStatus.PENDING;
    }
    // Helper method to check if booking is active
    isActive() {
        return [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED
        ].includes(this.status);
    }
    // Mark booking as confirmed
    confirm() {
        this.status = BookingStatus.CONFIRMED;
    }
    // Cancel the booking
    cancel() {
        this.status = BookingStatus.CANCELLED;
    }
    // Mark booking as failed
    markAsFailed() {
        this.status = BookingStatus.FAILED;
    }
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.bookings, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", Object)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => show_entity_1.Show, show => show.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'show_id' }),
    __metadata("design:type", show_entity_1.Show)
], Booking.prototype, "show", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_id' }),
    __metadata("design:type", Number)
], Booking.prototype, "showId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'num_seats' }),
    __metadata("design:type", Number)
], Booking.prototype, "numSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seat_entity_1.Seat, seat => seat.booking),
    __metadata("design:type", Array)
], Booking.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp with time zone',
        onUpdate: 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'booking_time',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Booking.prototype, "bookingTime", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings'),
    (0, typeorm_1.Index)('IDX_booking_show', ['showId']),
    (0, typeorm_1.Index)('IDX_booking_user', ['userId']),
    (0, typeorm_1.Index)('IDX_booking_status', ['status'])
], Booking);
