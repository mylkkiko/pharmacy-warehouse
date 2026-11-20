import prisma from "@/lib/prisma";
import { Medicine, MedicineData, MedicineRepository, MedicineWithStock } from "../types";

export function createPrismaMedicineRepository(): MedicineRepository {
    return {
        async findMany(search: string): Promise<MedicineWithStock[]> {
            const medicines = await prisma.medicine.findMany({
                where: search ?
                    {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { activeIngredient: { contains: search, mode: "insensitive" } },
                        ],
                    } : undefined,
                include: {
                    batches: {
                        select: { quantity: true },
                    },
                },
                orderBy: { name: "asc" },
            });
            return medicines.map((medicine) => ({
                id: medicine.id, 
                name: medicine.name,
                activeIngredient: medicine.activeIngredient,
                form: medicine.form,
                dosage: medicine.dosage,
                unit: medicine.unit,
                minStock: medicine.minStock,
                stock: medicine.batches.reduce((sum, batch) => sum + batch.quantity, 0)
            }))
        },
        async findById(id: string): Promise<Medicine | null> {
            return prisma.medicine.findUnique({ 
                where: { id }, 
                select: { 
                    id: true, 
                    name: true,  
                    activeIngredient: true,
                    form: true,
                    dosage: true,
                    unit: true,
                    minStock: true
                } 
            });
        },
        async create(data: MedicineData): Promise<void> {
            await prisma.medicine.create({ data });
        },
        async update(id: string, data: MedicineData): Promise<void> {
            await prisma.medicine.update({ where: { id }, data } );
        }
    }
}