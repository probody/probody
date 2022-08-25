export function formatPrice(p) {
    return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function declination(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
