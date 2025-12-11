"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showController = void 0;
const database_1 = require("../config/database");
const show_entity_1 = require("../models/show.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_show_dto_1 = require("../dto/create-show.dto");
const typeorm_1 = require("typeorm");
class ShowController {
    constructor() {
        this.router = require('express').Router();
        this.showRepository = database_1.AppDataSource.getRepository(show_entity_1.Show);
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/shows', this.getAllShows.bind(this));
        this.router.get('/shows/:id', this.getShowById.bind(this));
        this.router.post('/shows', this.createShow.bind(this));
        this.router.put('/shows/:id', this.updateShow.bind(this));
        this.router.delete('/shows/:id', this.deleteShow.bind(this));
    }
    async getAllShows(req, res, next) {
        try {
            const shows = await this.showRepository.find({
                order: { startTime: 'ASC' },
                where: { startTime: (0, typeorm_1.MoreThan)(new Date()) }
            });
            res.json({ success: true, data: shows });
        }
        catch (error) {
            next(error);
        }
    }
    async getShowById(req, res, next) {
        try {
            const showId = parseInt(req.params.id, 10);
            const show = await this.showRepository.findOne({
                where: { id: showId },
                relations: ['bookings']
            });
            if (!show) {
                return res.status(404).json({ success: false, message: 'Show not found' });
            }
            res.json({ success: true, data: show });
        }
        catch (error) {
            next(error);
        }
    }
    async createShow(req, res, next) {
        try {
            const showData = (0, class_transformer_1.plainToInstance)(create_show_dto_1.CreateShowDto, req.body);
            const errors = await (0, class_validator_1.validate)(showData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.map(e => e.constraints)
                });
            }
            const show = this.showRepository.create(showData);
            const result = await this.showRepository.save(show);
            res.status(201).json({
                success: true,
                data: result,
                message: 'Show created successfully'
            });
        }
        catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'A show with similar details already exists'
                });
            }
            next(error);
        }
    }
    async updateShow(req, res, next) {
        try {
            const showId = parseInt(req.params.id, 10);
            const show = await this.showRepository.preload({
                id: showId,
                ...req.body
            });
            if (!show) {
                return res.status(404).json({
                    success: false,
                    message: 'Show not found'
                });
            }
            const errors = await (0, class_validator_1.validate)(show);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.map(e => e.constraints)
                });
            }
            const updatedShow = await this.showRepository.save(show);
            res.json({
                success: true,
                data: updatedShow,
                message: 'Show updated successfully'
            });
        }
        catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'A show with similar details already exists'
                });
            }
            next(error);
        }
    }
    async deleteShow(req, res, next) {
        try {
            // Check if show has any bookings
            const showId = parseInt(req.params.id, 10);
            const show = await this.showRepository.findOne({
                where: { id: showId },
                relations: ['bookings']
            });
            if (!show) {
                return res.status(404).json({
                    success: false,
                    message: 'Show not found'
                });
            }
            if (show.bookings && show.bookings.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete show with existing bookings'
                });
            }
            const result = await this.showRepository.delete(showId);
            res.json({
                success: true,
                message: 'Show deleted successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.showController = new ShowController();
