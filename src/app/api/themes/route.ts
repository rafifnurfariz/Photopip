import path from "node:path";
import { scanThemeDirectory } from "./scan";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "theme-packs");
  const result = await scanThemeDirectory(root);

  for (const diagnostic of result.diagnostics) {
    const log = diagnostic.level === "error" ? console.warn : console.info;
    log(`[themes] ${diagnostic.folder}: ${diagnostic.message}`);
  }

  return Response.json(
    {
      themes: result.themes,
      // Absolute paths and raw filesystem errors stay on the server.
      diagnostics:
        process.env.NODE_ENV === "development" ? result.diagnostics : [],
    },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
