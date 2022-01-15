export function ensureTrailingSlash(str: string): string {
    if (!str.endsWith('/')) {
        return str + '/';
    }
    return str;
}

export function ensureLeadingSlash(str: string): string {
    if (!str.startsWith('/')) {
        return '/' + str;
    }
    return str;
}
