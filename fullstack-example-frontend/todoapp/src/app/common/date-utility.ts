import { DateTime } from "luxon";

export function isDateEqual(date1: DateTime | null, date2: DateTime | null): boolean {
    let result = false;
    if (date1 && date2) {
        result = date1.equals(date2);
    } else {
        result = !date1 && !date2;
    }
    return result;
}
