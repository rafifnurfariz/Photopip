import path from "node:path";
import { scanFrameDirectory } from "./scan";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "frame-packs");
  const result = await scanFrameDirectory(root);

  for (const diagnostic of result.diagnostics) {
    const log = diagnostic.level === "error" ? console.warn : console.info;
    log(`[frames] ${diagnostic.folder}: ${diagnostic.message}`);
  }

  return Response.json(
    {
      frames: result.frames,
      diagnostics:
        process.env.NODE_ENV === "development" ? result.diagnostics : [],
    },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
