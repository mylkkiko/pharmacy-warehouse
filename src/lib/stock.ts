import dayjs from "dayjs";
import { EXPIRING_SOON_DAYS } from "@/lib/constants";
export type BatchStatus = "EXPIRED" | "EXPIRING" | "OK";

type DateRange = {
    today: Date, 
    soon: Date
}

export function getStatusBoundaries(): DateRange {
    return {
        today: dayjs().startOf("day").toDate(),
        soon: dayjs().add(EXPIRING_SOON_DAYS, "day").endOf("day").toDate()
    }
}

export function getBatchStatus(expiryDate: Date): BatchStatus {
    const { today, soon } = getStatusBoundaries();
    if(expiryDate < today) {
        return "EXPIRED";
    } else if(expiryDate <= soon) {
        return "EXPIRING";
    } else { return "OK" }
}