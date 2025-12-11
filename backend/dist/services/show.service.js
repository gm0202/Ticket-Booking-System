"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showService = exports.ShowService = void 0;
const database_1 = require("../config/database");
const show_entity_1 = require("../models/show.entity");
class ShowService {
    constructor() {
        this.showRepository = database_1.AppDataSource.getRepository(show_entity_1.Show);
    }
    async getAllShows() {
        return await this.showRepository.find({
            order: { startTime: 'ASC' }
        });
    }
    async getShowById(id) {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        const show = await this.showRepository.findOne({
            where: { id: numericId },
            relations: ['bookings']
        });
        if (!show) {
            throw new Error('Show not found');
        }
        return show;
    }
    async createShow(showData) {
        const show = this.showRepository.create(showData);
        return await this.showRepository.save(show);
    }
    async updateShow(id, showData) {
        const show = await this.getShowById(id);
        Object.assign(show, showData);
        return await this.showRepository.save(show);
    }
    async deleteShow(id) {
        const result = await this.showRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Show not found');
        }
        return { success: true };
    }
    async getAvailableShows() {
        return await this.showRepository
            .createQueryBuilder('show')
            .where('show.startTime > NOW()')
            .andWhere('show.totalSeats > show.bookedSeats')
            .orderBy('show.startTime', 'ASC')
            .getMany();
    }
}
exports.ShowService = ShowService;
exports.showService = new ShowService();
