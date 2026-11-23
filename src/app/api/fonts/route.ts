// endpoint API buat ambil daftar font kustom dari folder public/assets/fonts
// dipanggil sama editor pas user buka tab teks
import path from "node:path";
import { NextResponse } from "next/server";
import { scanFontsDirectory } from "./scan";

// paksa route ini selalu jalan dinamis di server node biar file baru langsung kebaca
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// handler GET /api/fonts buat kirim list font dalam bentuk JSON
export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "fonts");
  try {
    const result = await scanFontsDirectory(root);
    // matiin cache biar font baru langsung muncul pas di-refresh
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    // kalau gagal baca folder, tetap balikin array kosong biar editor gak crash
    console.error("[api/fonts] Failed to scan fonts:", error);
    return NextResponse.json(
      { fonts: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
