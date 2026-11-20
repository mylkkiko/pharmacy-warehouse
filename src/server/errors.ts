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

export class DuplicateEmailError extends Error {
    constructor() {
        super("User with this email already exists");
        this.name = "DuplicateEmailError";
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super("User not found");
        this.name = "UserNotFoundError";
    }
}

export class CannotDeactivateSelfError extends Error {
    constructor() {
        super("You cannot deactivate your own account");
        this.name = "CannotDeactivateSelfError";
    }
}

export class LastAdminError extends Error {
    constructor() {
        super("There must be at least one active admin");
        this.name = "LastAdminError";
    }
}
