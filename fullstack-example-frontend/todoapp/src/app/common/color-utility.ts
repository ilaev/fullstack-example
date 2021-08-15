export function rgb2hex(rgb: string): string {
    const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (matches) {
        return '#' + matches.slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('');
    } else {
        return '';
    }
}
