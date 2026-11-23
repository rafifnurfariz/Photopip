import path from "node:path";
import { scanStickersDirectory } from "./scan";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "stickers");
  try {
    const result = await scanStickersDirectory(root);
    return Response.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.warn("[stickers] scan failed", error);
    return Response.json(
      { stickers: [], categories: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
