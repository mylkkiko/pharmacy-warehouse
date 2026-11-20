export type Medicine = {
    id: string,
    name: string,
    activeIngredient: string,
    form: string,
    dosage: string,
    unit: string,
    minStock: number
}

export type MedicineWithStock = Medicine & { stock: number };

export type MedicineData = Omit<Medicine, "id">;

export interface MedicineRepository {
    findMany: (search: string) => Promise<MedicineWithStock[]>,
    findById: (id: string) => Promise<Medicine | null>,
    create: (data: MedicineData) => Promise<void>,
    update: (id: string, MedicineData: MedicineData) => Promise<void>,
}

export type MovementType = "RECEIPT" | "ISSUE" | "WRITE_OFF";

export type NewBatch = {
    medicineId: string,
    batchNumber: string,
    expiryDate: Date,
    quantity: number,
    unitPrice: number,
    supplier?: string
}

export type BatchRecord = {
    id: string,
    medicineId: string,
    batchNumber: string,
    expiryDate: Date,
    quantity: number
}

export type StockFilter = {
    search: string,
    status: "all" | "expired" | "expiring" | "ok",
    today: Date,
    soon: Date
}

export type StockRecord = {
    id: string,
    medicine: string,
    dosage: string,
    batchNumber: string,
    supplier: string | null,
    receivedAt: Date,
    expiryDate: Date,
    quantity: number,
    unit: string
}

export type NewMovement = {
    type: MovementType,
    quantity: number,
    note?: string,
    batchId: string,
    userId: string
}

export type ReceiptRecord = {
    id: string,
    date: Date,
    medicine: string,
    batchNumber: string,
    expiryDate: Date,
    quantity: number,
    unit: string,
    unitPrice: number,
    receivedBy: string
}

export interface BatchRepository {
    create: (data: NewBatch) => Promise<string>,
    findById: (id: string) => Promise<BatchRecord | null>,
    findForStock: (filter: StockFilter) => Promise<StockRecord[]>,
    setQuantity: (id: string, quantity: number) => Promise<void>,
}

export interface MovementRepository {
    create: (data: NewMovement) => Promise<void>,
    findRecentReceipts: (limit: number) => Promise<ReceiptRecord[]>,
    countReceipts: () => Promise<number>,
}

export type Repositories = {
    batches: BatchRepository,
    movements: MovementRepository
}

export interface TransactionRunner {
    run<T>(fn: (repos: Repositories) => Promise<T>): Promise<T>
}
