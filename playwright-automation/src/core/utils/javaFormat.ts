/**
 * Number/date helpers that reproduce the Java formatting the legacy expected-content
 * builders relied on, so expected PDF text stays identical after the migration.
 */

/** Double.parseDouble that treats an empty value as 0 instead of throwing */
export function toNumber(value: string | undefined): number {
    if (value === undefined || value.trim() === '') return 0;
    const n = Number(value.replace(/,/g, ''));
    if (Number.isNaN(n)) throw new Error(`"${value}" is not a number`);
    return n;
}

/** String.format("%,.Nf", value) in an en-US locale */
export function formatGrouped(value: number, decimals = 2): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
    });
}

/** String.format("%.Nf", value) — no grouping separator */
export function formatPlain(value: number, decimals = 2): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: false,
    });
}

/** Accounting style used on the sale contract: negatives shown as "(1,234.00)" */
export function formatAccounting(value: number): string {
    return value < 0 ? `(${formatGrouped(Math.abs(value))})` : formatGrouped(value);
}

/** LocalDate.parse(isoDate).plusMonths(months).toString() — clamps to the month end like Java */
export function addMonthsIso(isoDate: string, months: number): string {
    const [y, m, d] = isoDate.split('-').map(Number);
    const totalMonths = y * 12 + (m - 1) + months;
    const year = Math.floor(totalMonths / 12);
    const month = totalMonths % 12; // 0-based
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const day = Math.min(d, lastDay);
    const pad = (n: number, len = 2) => String(n).padStart(len, '0');
    return `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}`;
}

/** String.replace(target, replacement) in Java: literal, all occurrences, no `$` patterns */
export function replaceAllLiteral(source: string, target: string, replacement: string): string {
    return source.split(target).join(replacement);
}
