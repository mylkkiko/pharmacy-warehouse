import { MovementRecord, MovementRepository } from "../repositories/types";

export function createMovementService(movements: MovementRepository) {
    return {
        list: (limit: number): Promise<MovementRecord[]> => {
            return movements.findAll(limit);
        }
    }
}
