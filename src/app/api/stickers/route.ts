// endpoint API buat ambil daftar stiker dan kategori dari public/assets/stickers
// dipakai panel stiker di editor supaya gambar baru langsung kebaca otomatis
import path from "node:path";
import { scanStickersDirectory } from "./scan";

// paksa route jalan dinamis tiap request tanpa cache statis
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// handler GET /api/stickers buat kirim daftar stiker sama kategorinya
export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "stickers");
  try {
    const result = await scanStickersDirectory(root);
    return Response.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    // kalau gagal baca folder, kirim list kosong biar UI gak ikut error
    console.warn("[stickers] scan failed", error);
    return Response.json(
      { stickers: [], categories: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
