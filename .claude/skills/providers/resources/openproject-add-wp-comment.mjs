/**
 * Add a visible journal comment on a work package (OpenProject v3 API).
 *
 * **Important:** `PATCH .../work_packages/:id` with `comment` returns 200 but does **not**
 * create Activity comments on this server — use **POST** `.../work_packages/:id/activities` instead.
 *
 * Usage: node .claude/skills/providers/resources/openproject-add-wp-comment.mjs <workPackageId> <path-to-comment.md>
 *
 * Auth: reads OPENPROJECT_URL + OPENPROJECT_API_KEY from repo .mcp.json → mcpServers.openproject.env
 *       Falls back to OPENPROJECT_URL / OPENPROJECT_API_KEY environment variables.
 *       Bindings for this project: qa-artifacts/qa-config/tools.md · adapter: .claude/skills/providers/openproject.md
 */
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const [, , wpIdArg, mdPath] = process.argv;
if (!wpIdArg || !mdPath) {
  console.error(
    "Usage: node openproject-add-wp-comment.mjs <workPackageId> <path-to-comment.md>"
  );
  process.exit(1);
}

const wpId = Number(wpIdArg, 10);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..", "..", ".."); // resources/ → providers/ → skills/ → .claude/ → repo root
// Try .mcp.json first, then fall back to environment variables
let env = { OPENPROJECT_URL: process.env.OPENPROJECT_URL, OPENPROJECT_API_KEY: process.env.OPENPROJECT_API_KEY };
const cfgCandidates = [
  join(root, ".mcp.json"),
];
for (const cfgPath of cfgCandidates) {
  if (fs.existsSync(cfgPath)) {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    const candidate = cfg.mcpServers?.openproject?.env;
    if (candidate?.OPENPROJECT_URL && candidate?.OPENPROJECT_API_KEY) {
      env = candidate;
      break;
    }
  }
}
if (!env?.OPENPROJECT_URL || !env?.OPENPROJECT_API_KEY) {
  console.error("Missing OpenProject credentials. Set OPENPROJECT_URL and OPENPROJECT_API_KEY env vars, or add them to .mcp.json");
  process.exit(1);
}

const base = env.OPENPROJECT_URL.replace(/\/$/, "");
const auth =
  "Basic " +
  Buffer.from(`apikey:${env.OPENPROJECT_API_KEY}`).toString("base64");

const raw = fs.readFileSync(join(root, mdPath), "utf8");

const postBody = JSON.stringify({
  comment: { format: "markdown", raw },
});

const postRes = await fetch(
  `${base}/api/v3/work_packages/${wpId}/activities`,
  {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: postBody,
  }
);

const text = await postRes.text();
if (!postRes.ok) {
  console.error(postRes.status, text);
  process.exit(1);
}

let id = "?";
try {
  id = JSON.parse(text).id;
} catch {
  /* ignore */
}
console.log(
  `Comment posted to work package #${wpId} (activity id ${id}, HTTP ${postRes.status}).`
);
