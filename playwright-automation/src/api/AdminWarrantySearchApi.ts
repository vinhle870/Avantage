/**
 * How the admin API key is sent on one request.
 *  - `xApiKey`      — `X-API-KEY: <key>` (the form the Dev build accepts — AP2435_001 step 2)
 *  - `bearer`       — `Authorization: Bearer <key>` (the form the AP-2435 ticket text names — Q-001)
 *  - `none`         — no key header at all
 *  - `wrongXApiKey` / `wrongBearer` — the same two headers carrying a fixed fake key
 */
export type ApiKeyMode = 'xApiKey' | 'bearer' | 'none' | 'wrongXApiKey' | 'wrongBearer';

/** One answered request: everything a flow needs to assert, and nothing that holds the key. */
export interface ApiAnswer {
    /** Human-readable description of the request, safe to print (never holds the key). */
    readonly label: string;
    readonly status: number;
    readonly contentType: string;
    readonly text: string;
    /** Parsed body, or `undefined` when the body is not valid JSON. */
    readonly json: unknown;
}

/**
 * The fixed fake key of AP2435_009: shares only its length (64) with the real key, never any of its characters
 * on purpose.
 */
export const WRONG_API_KEY = 'QA-AP2435-INVALID-KEY-'.padEnd(64, '0');

/** Per-request time limit (the manual cases wait at most 30 s for an answer). */
const TIMEOUT_MS = 30_000;

/**
 * Admin API — `GET /api/admin/search-warranty?query=<value>` (AP-2435). API object: request + reader only,
 * no assertions (those live in WarrantySearchApiFlow).
 *
 * Key handling: the key is held in an ECMAScript private field, sent only as a per-request header, and never
 * written into a label, an error or a return value.
 *
 * The requests go through Node's built-in `fetch`, NOT Playwright's `APIRequestContext`, on purpose (R5 F-1):
 * Playwright records every `request.get` as its own step in the HTML report, and when a request gets no answer
 * (host unreachable, DNS failure, timeout) that step's error holds the full call log — request headers, the key
 * among them — before any catch block can clean it. `fetch` is not instrumented by the test runner, so nothing
 * about the request is recorded except what the flow's own `test.step` and annotations write.
 */
export class AdminWarrantySearchApi {
    static readonly PATH = '/api/admin/search-warranty';

    readonly #key: string;

    constructor(private readonly origin: string, apiKey: string) {
        this.#key = apiKey;
    }

    private headersFor(mode: ApiKeyMode): Record<string, string> {
        const headers: Record<string, string> = { accept: 'application/json' };
        switch (mode) {
            case 'xApiKey': headers['X-API-KEY'] = this.#key; break;
            case 'bearer': headers['Authorization'] = `Bearer ${this.#key}`; break;
            case 'wrongXApiKey': headers['X-API-KEY'] = WRONG_API_KEY; break;
            case 'wrongBearer': headers['Authorization'] = `Bearer ${WRONG_API_KEY}`; break;
            case 'none': break;
        }
        return headers;
    }

    /** Removes every occurrence of the key from a text. */
    private redact(text: string): string {
        return this.#key ? text.split(this.#key).join('<redacted>') : text;
    }

    /**
     * One line describing a failed send: the error's name and message, then each `cause` in its chain
     * (up to 5 levels), every part with the key removed and all line breaks folded.
     */
    private describeFailure(error: unknown): string {
        const parts: string[] = [];
        let current: unknown = error;
        for (let depth = 0; current !== undefined && current !== null && depth < 5; depth++) {
            if (current instanceof Error) {
                const code = (current as { code?: unknown }).code;
                parts.push(`${current.name}: ${current.message}${typeof code === 'string' ? ` [${code}]` : ''}`);
                current = (current as { cause?: unknown }).cause;
            } else {
                parts.push(String(current));
                current = undefined;
            }
        }
        return this.redact(parts.join(' <- caused by: ')).replace(/\s*[\r\n]+\s*/g, ' ');
    }

    /**
     * Sends one search. `query === undefined` sends no `query` parameter at all (AP2435_011 request B);
     * `''` sends `?query=` (request A). The value is encoded with `encodeURIComponent` (a space becomes `%20`;
     * `(` `)` `.` `-` are left as they are).
     */
    async search(query: string | undefined, mode: ApiKeyMode): Promise<ApiAnswer> {
        const url = query === undefined
            ? `${this.origin}${AdminWarrantySearchApi.PATH}`
            : `${this.origin}${AdminWarrantySearchApi.PATH}?query=${encodeURIComponent(query)}`;
        const label = `GET ${AdminWarrantySearchApi.PATH}${query === undefined ? ' (no query parameter)' : `?query=${JSON.stringify(query)}`} [key: ${mode}]`;

        let status: number;
        let contentType: string;
        let text: string;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headersFor(mode),
                signal: AbortSignal.timeout(TIMEOUT_MS),
            });
            status = response.status;
            contentType = response.headers.get('content-type') ?? '';
            text = await response.text();
        } catch (e) {
            // A new error with no `cause`: the original (and its chain) is described in one redacted line, then dropped.
            throw new Error(`${label} was not answered (send invalid — BLOCKED (environment)): ${this.describeFailure(e)}`);
        }
        let json: unknown;
        try { json = JSON.parse(text); } catch { json = undefined; }
        return { label, status, contentType, text, json };
    }
}
