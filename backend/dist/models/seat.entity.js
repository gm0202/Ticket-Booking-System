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
exports.Seat = void 0;
const typeorm_1 = require("typeorm");
const show_entity_1 = require("./show.entity");
const booking_entity_1 = require("./booking.entity");
let Seat = class Seat {
    constructor() {
        this.booking = null;
        this.bookingId = null;
        this.isBooked = false;
    }
};
exports.Seat = Seat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Seat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => show_entity_1.Show, show => show.seats, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'show_id' }),
    __metadata("design:type", show_entity_1.Show)
], Seat.prototype, "show", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_id' }),
    __metadata("design:type", Number)
], Seat.prototype, "showId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, booking => booking.seats, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'booking_id' }),
    __metadata("design:type", Object)
], Seat.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_id', nullable: true }),
    __metadata("design:type", Object)
], Seat.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seat_number' }),
    __metadata("design:type", Number)
], Seat.prototype, "seatNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_booked', default: false }),
    __metadata("design:type", Boolean)
], Seat.prototype, "isBooked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Seat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Seat.prototype, "updatedAt", void 0);
exports.Seat = Seat = __decorate([
    (0, typeorm_1.Entity)('seats'),
    (0, typeorm_1.Index)('IDX_seat_show', ['showId']),
    (0, typeorm_1.Index)('IDX_seat_booking', ['bookingId']),
    (0, typeorm_1.Index)('IDX_seat_number', ['seatNumber', 'showId'], { unique: true })
], Seat);
