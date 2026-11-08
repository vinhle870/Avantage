import fs from 'fs';

/**
 * PDF text extraction (replaces FileManage.ReadPDFFile_func, which used PDFBox).
 *
 * Text items are emitted in content-stream order, one line per baseline, which is
 * the order PDFBox's PDFTextStripper produced and the legacy templates were written
 * against. ZapfDingbats glyphs are mapped back to the symbols they draw (pdf.js reports
 * the raw character codes, e.g. "3" for ✓).
 */

const ZAPF_DINGBATS: Record<string, string> = {
    '3': '✓',
    '4': '✔',
    '7': '✗',
    '8': '✘',
    'n': '■',
    'o': '❏',
    'q': '❑',
    'u': '◆',
};

// pdfjs-dist ships as an ES module; load it lazily so CommonJS test files can use this helper
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const importPdfJs = new Function('return import("pdfjs-dist/legacy/build/pdf.mjs")') as
    () => Promise<typeof import('pdfjs-dist')>;

export async function readPdfText(source: Buffer | string): Promise<string> {
    const bytes = typeof source === 'string' ? fs.readFileSync(source) : source;
    const pdfjs = await importPdfJs();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), verbosity: 0 }).promise;

    const lines: string[] = [];
    for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        // Fonts are resolved while building the operator list; needed to detect ZapfDingbats
        await page.getOperatorList();

        let line = '';
        let lastY: number | null = null;
        let lastHeight = 0;
        let lastXEnd: number | null = null;

        // pdf.js's own end-of-line markers are ignored: like PDFBox, runs whose
        // glyph boxes overlap vertically belong to the same line.
        for (const item of content.items) {
            if (!('str' in item) || item.str === '') continue;
            const x = item.transform[4];
            const y = item.transform[5];
            const sameLineTolerance = Math.max(item.height, lastHeight, 2) * 0.75;
            if (lastY !== null && Math.abs(y - lastY) > sameLineTolerance) {
                lines.push(line);
                line = '';
                lastXEnd = null;
            } else if (lastXEnd !== null && x - lastXEnd > 1 && !line.endsWith(' ') && !item.str.startsWith(' ')) {
                line += ' ';
            }
            line += isZapfDingbats(page, item.fontName)
                ? [...item.str].map(ch => ZAPF_DINGBATS[ch] ?? ch).join('')
                : item.str;
            lastY = y;
            lastHeight = item.height;
            lastXEnd = x + item.width;
        }
        if (line) lines.push(line);
        page.cleanup();
    }
    await doc.destroy();
    return lines.join('\n');
}

function isZapfDingbats(page: { commonObjs: { has(id: string): boolean; get(id: string): any } }, fontId: string): boolean {
    if (!page.commonObjs.has(fontId)) return false;
    const font = page.commonObjs.get(fontId);
    return typeof font?.name === 'string' && font.name.includes('ZapfDingbats');
}

/**
 * Normalise PDF/expected text for comparison: unify line endings, trim and collapse
 * spaces on each line, and drop empty lines. Spacing between text runs differs
 * slightly between PDF libraries; content and line order do not.
 */
export function normalizePdfText(value: string): string {
    return value
        .replace(/\r/g, '')
        .split('\n')
        .map(l => l.replace(/[ \t ]+/g, ' ').trim())
        .filter(l => l.length > 0)
        .join('\n');
}

/**
 * Single-line form of normalizePdfText for "contains" checks: line breaks count as
 * spaces. Where a PDF breaks a line depends on which fields are filled (an empty field
 * can pull its neighbours onto one line), while the content and its order do not.
 */
export function flattenPdfText(value: string): string {
    return normalizePdfText(value).split('\n').join(' ');
}
