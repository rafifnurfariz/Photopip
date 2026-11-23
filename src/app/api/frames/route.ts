// endpoint API buat ambil daftar paket bingkai yang tersedia di folder public/assets/frame-packs
// hasilnya dipakai studio dan editor buat nampilin pilihan frame
import path from "node:path";
import { scanFrameDirectory } from "./scan";

// selalu scan ulang di server tiap request biar paket bingkai baru langsung kebaca
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// handler GET /api/frames buat scan folder bingkai dan kirim hasilnya ke client
export async function GET() {
  const root = path.join(process.cwd(), "public", "assets", "frame-packs");
  const result = await scanFrameDirectory(root);

  // cetak warning atau info kalau ada folder bingkai yang bermasalah ke log server
  for (const diagnostic of result.diagnostics) {
    const log = diagnostic.level === "error" ? console.warn : console.info;
    log(`[frames] ${diagnostic.folder}: ${diagnostic.message}`);
  }

  // diagnostics cuma dikirim ke browser waktu development biar gak bocor di production
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
