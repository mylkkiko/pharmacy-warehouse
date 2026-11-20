export class DuplicateBatchError extends Error {
    constructor() {
        super("Batch with this number already exists for this medicine");
        this.name = "DuplicateBatchError";
    }
}
