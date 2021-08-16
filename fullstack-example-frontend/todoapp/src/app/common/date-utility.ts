export function isDateEqual(date1: Date | null, date2: Date | null): boolean {
    let result = false;
    if (date1 && date2) {
        result = date1.getTime() === date2.getTime();
    } else {
        result = !date1 && !date2;
    }
    return result;
}
