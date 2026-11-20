export class DuplicateBatchError extends Error {
    constructor() {
        super("Batch with this number already exists for this medicine");
        this.name = "DuplicateBatchError";
    }
}

export class NotEnoughStockError extends Error {
    constructor(available: number) {
        super(`Not enough stock. Available: ${available}`);
        this.name = "NotEnoughStockError";
    }
}

export class StockChangedError extends Error {
    constructor() {
        super("Stock changed, please try again");
        this.name = "StockChangedError";
    }
}
