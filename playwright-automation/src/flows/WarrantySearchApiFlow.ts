import { expect, test } from '@playwright/test';
import { AdminWarrantySearchApi, ApiAnswer, ApiKeyMode } from '../api/AdminWarrantySearchApi';

/** One search result entry; the ticket documents only `contractNumber` (the Dev build returns 24 fields — O-3). */
interface SearchEntry { contractNumber?: unknown }

const is5xx = (status: number): boolean => status >= 500;
const is2xx = (status: number): boolean => status >= 200 && status < 300;

/** Top-level field names that would mean the list is paged (Q-008). Matched case-insensitively. */
const PAGING_FIELDS = ['total', 'totalcount', 'totalitems', 'count', 'page', 'pagenumber', 'pagesize', 'pages', 'totalpages',
    'next', 'nextpage', 'previous', 'prev', 'limit', 'offset', 'skip', 'take', 'cursor', 'hasmore', 'hasnext'];

/**
 * Admin API warranty search — AP-2435, Dev (v2dev). Read-only: every call is a GET search; nothing is created.
 *
 * Mirrors the manual result rules of qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md (Execution Context):
 *  1. HTTP 5xx → FAIL.
 *  2. 401/403 on a request sent with the accepted key form (`X-API-KEY`) → BLOCKED by Q-012 (the key was refused:
 *     expired or revoked), so the test is skipped with that reason instead of passing or failing.
 *  3. "Valid JSON" and "lists <C>" are asserted only on a 2xx.
 * Record-only facts (entry counts, Bearer refusal, the 10-item cap, extra fields) go to the test's annotations,
 * never into an assertion the case does not make.
 *
 * The requests are sent by AdminWarrantySearchApi with Node's `fetch`, not a Playwright request context (R5 F-1):
 * the key travels only as a per-request header there, and nothing here prints it. Each request still shows in the
 * report as the flow's own `test.step` plus an annotation (names and counts only, never response values).
 */
export class WarrantySearchApiFlow {
    private constructor(private readonly api: AdminWarrantySearchApi) {}

    /**
     * `playwright` is kept in the signature for the spec's fixture call; no Playwright request context is opened
     * (see the class note).
     */
    static async open(_playwright: unknown, origin: string, apiKey: string): Promise<WarrantySearchApiFlow> {
        return new WarrantySearchApiFlow(new AdminWarrantySearchApi(origin, apiKey));
    }

    /** Nothing to release: `fetch` keeps no per-flow context. Kept so the spec's afterEach stays unchanged. */
    async dispose(): Promise<void> {
        // no-op
    }

    // ---------- helpers (no test.step of their own) ----------

    private record(description: string): void {
        test.info().annotations.push({ type: 'AP-2435 observation', description });
    }

    /** Entries of a 2xx body: `{"items":[…]}` (the Dev build, Q-009) or a bare array. `undefined` → neither shape. */
    private entriesOf(answer: ApiAnswer): SearchEntry[] | undefined {
        const body = answer.json as { items?: unknown } | unknown[] | undefined;
        if (Array.isArray(body)) return body as SearchEntry[];
        if (body && typeof body === 'object' && Array.isArray((body as { items?: unknown }).items)) {
            return (body as { items: SearchEntry[] }).items;
        }
        return undefined;
    }

    private contractNumbers(entries: SearchEntry[]): string[] {
        return entries.map(e => String(e.contractNumber));
    }

    /**
     * Shape of a 2xx body, NAMES ONLY (AP2435_001 step 3, 011 step 4, 012 step 3 — Q-008, Q-009): the top-level
     * shape and keys, the paging fields among them, and the entry field names besides `contractNumber`.
     * Never a value: the entries hold client personal data.
     */
    private shapeOf(answer: ApiAnswer, entries: SearchEntry[]): string {
        const body = answer.json;
        let topLevel: string;
        let paging: string[] = [];
        if (Array.isArray(body)) {
            topLevel = 'bare list';
        } else {
            const keys = Object.keys(body as Record<string, unknown>);
            topLevel = `object {${keys.join(', ')}}`;
            paging = keys.filter(k => PAGING_FIELDS.includes(k.toLowerCase()));
        }
        const fieldNames = new Set<string>();
        for (const entry of entries) {
            if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
                for (const key of Object.keys(entry)) if (key !== 'contractNumber') fieldNames.add(key);
            }
        }
        const fields = [...fieldNames];
        return `shape: ${topLevel}; paging fields: ${paging.join(', ') || '(none)'}; `
            + `entry fields besides contractNumber (${fields.length}): ${fields.join(', ') || '(none)'}`;
    }

    private summary(answer: ApiAnswer): string {
        const entries = this.entriesOf(answer);
        if (is2xx(answer.status) && entries) {
            const numbers = this.contractNumbers(entries);
            return `${answer.label} → HTTP ${answer.status}, ${entries.length} entries: ${numbers.join(', ') || '(none)'}`
                + ` — ${this.shapeOf(answer, entries)}`;
        }
        return `${answer.label} → HTTP ${answer.status} ${answer.contentType} ${answer.text.slice(0, 200)}`;
    }

    /** Result rule 2: a refused key on the accepted form blocks the case (Q-012) instead of passing or failing it. */
    private skipIfKeyRefused(answer: ApiAnswer): void {
        test.skip(answer.status === 401 || answer.status === 403,
            `BLOCKED by Q-012 — the admin API key was refused (${answer.label} → HTTP ${answer.status}). `
            + 'Check the key is still active on /admin/api-keys (QA-automation expires 2026-12-05) and refresh AVP_ADMIN_API_KEY.');
    }

    /** Rule 1 + rule 3 shape check: not 5xx; a 2xx body is valid JSON whose every entry carries a contractNumber. */
    private expectAnsweredWithoutServerError(answer: ApiAnswer): SearchEntry[] | undefined {
        expect(is5xx(answer.status), `${answer.label}: HTTP ${answer.status} must not be a server error`).toBe(false);
        if (!is2xx(answer.status)) return undefined;
        expect(answer.json, `${answer.label}: the 2xx body must be valid JSON — got: ${answer.text.slice(0, 200)}`).not.toBeUndefined();
        const entries = this.entriesOf(answer);
        expect(entries, `${answer.label}: the body must be {"items":[…]} or a list — got: ${answer.text.slice(0, 200)}`).toBeDefined();
        for (const [i, entry] of (entries ?? []).entries()) {
            expect(typeof entry?.contractNumber, `${answer.label}: entry ${i} must carry a contractNumber`).toBe('string');
        }
        return entries;
    }

    // ---------- business steps ----------

    /**
     * AP2435_001 step 2–3 — header probe (Q-001): the search is sent with `X-API-KEY` and with `Authorization: Bearer`.
     * Neither may be 5xx; at least one must be 2xx (the accepted form); every accepted answer lists `contract`.
     * A refused form is recorded, not failed. Both refused (401/403) → BLOCKED by Q-012.
     */
    async probeKeyHeaderForms(query: string, contract: string): Promise<void> {
        await test.step(`Search "${query}" with the key as X-API-KEY and as Authorization Bearer — at least one form is accepted and lists ${contract}`, async () => {
            const forms: ApiKeyMode[] = ['xApiKey', 'bearer'];
            const answers: ApiAnswer[] = [];
            for (const mode of forms) {
                const answer = await this.api.search(query, mode);
                this.record(`Q-001 header probe: ${this.summary(answer)}`);
                expect(is5xx(answer.status), `${answer.label}: HTTP ${answer.status} must not be a server error`).toBe(false);
                answers.push(answer);
            }
            const accepted = answers.filter(a => is2xx(a.status));
            const refused = answers.every(a => a.status === 401 || a.status === 403);
            test.skip(refused, 'BLOCKED by Q-012 — both key header forms were refused (401/403); confirm the key is active on /admin/api-keys');
            expect(accepted.length, `At least one key header form must be accepted (2xx) — got ${answers.map(a => a.status).join(' / ')}`)
                .toBeGreaterThan(0);
            this.record(`Accepted key form: ${accepted.map(a => a.label.match(/\[key: (\w+)\]/)?.[1]).join('+')}`);
            for (const answer of accepted) {
                const entries = this.expectAnsweredWithoutServerError(answer)!;
                expect(this.contractNumbers(entries), `${answer.label}: lists contract ${contract}`).toContain(contract);
            }
        });
    }

    /** AP2435_001 – 005 core check: a search with the accepted key answers 2xx with valid JSON listing `contract`. */
    async searchListsContract(query: string, contract: string): Promise<void> {
        await test.step(`Search "${query}" lists contract ${contract}`, async () => {
            const answer = await this.api.search(query, 'xApiKey');
            this.record(this.summary(answer));
            this.skipIfKeyRefused(answer);
            expect(is5xx(answer.status), `${answer.label}: HTTP ${answer.status} must not be a server error`).toBe(false);
            expect(is2xx(answer.status), `${answer.label}: HTTP ${answer.status} must be 2xx — body: ${answer.text.slice(0, 200)}`).toBe(true);
            const entries = this.expectAnsweredWithoutServerError(answer)!;
            expect(this.contractNumbers(entries),
                `${answer.label}: lists contract ${contract} (entries: ${entries.length}; the Dev build returns at most 10 — O-1)`)
                .toContain(contract);
        });
    }

    /**
     * Record-only search (AP2435_002 step 3, 006, 007, 011, 012): no 5xx; a 2xx body is valid JSON whose every entry
     * carries a contractNumber; status, count and whether `contract` is listed are recorded, not asserted.
     * With the accepted form (`xApiKey`) a 401/403 blocks the case; with any other form it is recorded.
     */
    async recordSearch(query: string | undefined, contract: string, mode: ApiKeyMode = 'xApiKey', note = ''): Promise<void> {
        const shown = query === undefined ? '(no query parameter)' : `"${query}"`;
        await test.step(`Search ${shown} [key: ${mode}] — answered without a server error; result recorded${note ? ` (${note})` : ''}`, async () => {
            const answer = await this.api.search(query, mode);
            const entries = this.entriesOf(answer);
            const listed = is2xx(answer.status) && entries ? this.contractNumbers(entries).includes(contract) : false;
            this.record(`${note ? `${note}: ` : ''}${this.summary(answer)}${is2xx(answer.status) ? ` — ${contract} ${listed ? 'listed' : 'not listed'}` : ''}`);
            if (mode === 'xApiKey') this.skipIfKeyRefused(answer);
            this.expectAnsweredWithoutServerError(answer);
        });
    }

    /** AP2435_008 / 009: a search without a valid key returns no contract data (no contractNumber, not `contract`). */
    async searchReturnsNoContractData(query: string, contract: string, mode: ApiKeyMode): Promise<void> {
        await test.step(`Search "${query}" [key: ${mode}] returns no contract data`, async () => {
            const answer = await this.api.search(query, mode);
            this.record(`Q-002: ${this.summary(answer)}`);
            expect(is5xx(answer.status), `${answer.label}: HTTP ${answer.status} must not be a server error`).toBe(false);
            expect(answer.text, `${answer.label}: the body must not hold contract ${contract}`).not.toContain(contract);
            expect(answer.text, `${answer.label}: the body must not hold any contractNumber`).not.toContain('contractNumber');
        });
    }

    /**
     * AP2435_010: a query that cannot match anything — 2xx or a 4xx other than 401/403 (those block the case),
     * no contractNumber in the body, and a 2xx body is valid JSON.
     */
    async searchListsNoContracts(query: string): Promise<void> {
        await test.step(`Search "${query}" lists no contracts`, async () => {
            const answer = await this.api.search(query, 'xApiKey');
            this.record(`Q-010: ${this.summary(answer)}`);
            this.skipIfKeyRefused(answer);
            expect(is5xx(answer.status), `${answer.label}: HTTP ${answer.status} must not be a server error`).toBe(false);
            expect(answer.status >= 200 && answer.status < 500, `${answer.label}: HTTP ${answer.status} must be 2xx or 4xx`).toBe(true);
            expect(answer.text, `${answer.label}: the body must not hold any contractNumber`).not.toContain('contractNumber');
            if (is2xx(answer.status)) {
                const entries = this.expectAnsweredWithoutServerError(answer);
                expect(entries?.length, `${answer.label}: the list of contracts found is empty`).toBe(0);
            }
        });
    }
}
