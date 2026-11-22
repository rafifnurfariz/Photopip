import path from "node:path";
import { NextResponse } from "next/server";
import { scanFontsDirectory } from "./scan";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "fonts");
  try {
    const result = await scanFontsDirectory(root);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[api/fonts] Failed to scan fonts:", error);
    return NextResponse.json(
      { fonts: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
