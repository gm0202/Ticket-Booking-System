import { AppDataSource } from '../config/database';
import { Show } from '../models/show.entity';

export class ShowService {
    private showRepository = AppDataSource.getRepository(Show);

    async getAllShows() {
        return await this.showRepository.find({
            order: { startTime: 'ASC' }
        });
    }

    async getShowById(id: string | number) {
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

    async createShow(showData: Partial<Show>) {
        const show = this.showRepository.create(showData);
        return await this.showRepository.save(show);
    }

    async updateShow(id: string, showData: Partial<Show>) {
        const show = await this.getShowById(id);
        Object.assign(show, showData);
        return await this.showRepository.save(show);
    }

    async deleteShow(id: string) {
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

export const showService = new ShowService();
