import { Medicine, MedicineData, MedicineRepository, MedicineWithStock } from "../repositories/types";

export function createMedicineService (repo: MedicineRepository) {
    return {
        list: (search: string): Promise<MedicineWithStock[]> => {
            return repo.findMany(search);
        },
        getById: (id: string): Promise<Medicine | null> => {
            return repo.findById(id);
        },
        create: (data: MedicineData) => {
            return repo.create(data);
        },
        update: (id: string, medicineData: MedicineData) => {
            return repo.update(id, medicineData)
        }
    }
}