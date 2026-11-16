# 📸 PhotoPip

> **Bilik foto langsung di browser — tanpa instalasi, tanpa akun, tanpa data dikirim ke server.**

PhotoPip adalah aplikasi photo booth berbasis web. Pilih bentuk cetakan, ambil atau unggah foto, hias dengan tema/stiker/teks/filter, lalu unduh hasilnya sebagai PNG atau JPEG siap cetak — semua terjadi di dalam browser kamu.

---

## Daftar Isi

- [Fitur utama](#fitur-utama)
- [Demo](#demo)
- [Cara menggunakan situs](#cara-menggunakan-situs)
- [Privasi dan penyimpanan](#privasi-dan-penyimpanan)
- [Tech stack](#tech-stack)
- [Arsitektur kode](#arsitektur-kode)
- [Struktur folder](#struktur-folder)
- [Setup dan instalasi](#setup-dan-instalasi)
- [Perintah yang tersedia](#perintah-yang-tersedia)
- [Fitur lengkap](#fitur-lengkap)
- [Paket tema — cara membuat sendiri](#paket-tema--cara-membuat-sendiri)
- [Panduan pengembang](#panduan-pengembang)
- [Pengujian](#pengujian)
- [Pemecahan masalah](#pemecahan-masalah)
- [Kontribusi](#kontribusi)
- [Lisensi font](#lisensi-font)

---

## Fitur utama

- **5 tata letak cetak** — strip vertikal (3 atau 4 foto), grid 2×2 atau 2×3, dan satu foto besar
- **Kamera langsung** — video depan, timer 0/3/5 detik, mode cermin, pengambilan otomatis semua slot
- **Upload foto** — dari galeri/perangkat, diproses dan dikecilkan otomatis di browser
- **Retake** — ganti satu foto tanpa kehilangan foto lain atau hiasan yang sudah ditambahkan
- **Editor Fabric.js** — geser, ubah ukuran, putar stiker dan teks langsung di kanvas
- **15 stiker bawaan** — SVG inline, tidak perlu request ke internet
- **6 filter foto** — asli, hitam putih, hangat, sejuk, vintage, pudar
- **Tema paket** — tambah tema sendiri dengan meletakkan folder PNG di `public/assets/theme-packs/`
- **Undo/redo** — sampai 40 langkah
- **Ekspor PNG atau JPEG** — resolusi penuh ukuran cetak, bukan ukuran layar
- **7 bahasa** — Indonesia, Inggris, Spanyol, Prancis, Jerman, Jepang, Mandarin
- **Mode gelap/terang**
- **Responsif** — desktop dan mobile (layar ≥ 320 px)
- **Semua data di browser** — tidak ada server foto, tidak ada database, tidak ada akun

---

## Demo

> 🔗 _(Tambahkan URL demo di sini)_

---

## Cara menggunakan situs

Tidak perlu instalasi. Cukup buka di browser.

### Langkah-langkah

1. **Pilih tata letak** — klik tombol layout di panel kanan untuk memilih bentuk cetakan (strip 4 foto, 3 foto, grid, atau satu foto besar).
2. **Siapkan foto** — tekan tombol kamera dan izinkan akses, atau klik tombol upload untuk memakai foto dari perangkat.
3. **Ambil foto** — tekan shutter satu per satu, atau gunakan tombol ⏩ untuk mengisi semua slot otomatis dengan jeda antar foto.
4. **Retake jika perlu** — klik thumbnail foto di filmstrip untuk mengganti satu foto tanpa mengulang semuanya.
5. **Masuk ke editor** — setelah semua slot terisi, klik tombol "Edit". Di sini ada 5 panel:
   - **Tema** — pilih tampilan keseluruhan (latar, bingkai, font)
   - **Foto** — atur filter per foto, atau retake dari sini
   - **Stiker** — cari dan tambahkan stiker, geser/putar/ubah ukuran di kanvas
   - **Teks** — tambah tulisan, atur font, warna, ukuran, rotasi
   - **Properti** — properti detail objek yang sedang dipilih di kanvas
6. **Unduh** — pilih format PNG atau JPEG, lalu klik tombol Download.

### Tips

- Kamera hanya bisa digunakan di **HTTPS** atau **`http://localhost`**. Tidak bisa di `http://192.168.x.x`.
- Semua hiasan (stiker, teks, filter, tema) **tidak hilang** saat retake.
- Zoom editor (50%–400%) hanya mempengaruhi tampilan, **bukan ukuran file unduhan**.
- Halaman di-refresh? **Semua foto hilang** — belum ada penyimpanan permanen.

---

## Privasi dan penyimpanan

PhotoPip dirancang tanpa server foto:

- Semua foto **diproses di perangkatmu sendiri** (di memori browser).
- **Tidak ada foto yang dikirim ke server.** Foto tidak pernah meninggalkan perangkatmu.
- **Tidak ada database foto**, tidak ada akun, tidak ada login.
- Server hanya punya satu endpoint: `GET /api/themes` — untuk membaca folder paket tema lokal.
- Yang disimpan di browser hanya: pilihan **bahasa** dan **mode gelap/terang** (via `localStorage`).
- Setelah halaman ditutup atau di-refresh, **semua foto dan komposisi hilang**.

---

## Tech stack

| Teknologi                   | Versi  | Fungsi                                                                   |
| --------------------------- | ------ | ------------------------------------------------------------------------ |
| **Next.js**                 | 16.4.5 | Framework utama — routing, server, build produksi, App Router            |
| **React**                   | 19.3   | Library UI — komponen, state, rendering                                  |
| **TypeScript**              | 5.9    | Bahasa — type safety, autocomplete, pendeteksi error sebelum runtime     |
| **Fabric.js**               | 7.4.0  | Canvas editor — drag, resize, rotate stiker dan teks di kanvas           |
| **next-themes**             | 0.4.6  | Mode gelap/terang tanpa flash saat halaman dimuat                        |
| **CSS**                     | —      | Satu file global `globals.css` — tidak ada Tailwind, tidak ada CSS-in-JS |
| **Vitest**                  | 4.1    | Test runner — cepat, berbasis Vite                                       |
| **Testing Library + jsdom** | —      | Tes komponen React tanpa buka browser sungguhan                          |
| **ESLint**                  | 9      | Linter — cegah pola kode bermasalah                                      |
| **Prettier**                | 3.6    | Formatter — format kode dan Markdown otomatis                            |
| **Knip**                    | 6      | Deteksi file, export, dan dependency yang tidak terpakai                 |

> **Kenapa Fabric.js?** Canvas API bawaan browser bisa menggambar, tapi tidak mendukung interaksi objek (klik, drag, resize). Fabric.js menambahkan layer manajemen objek di atas canvas sehingga stiker dan teks bisa dimanipulasi seperti di aplikasi desain.

> **Kenapa satu file CSS?** Satu file global lebih mudah di-maintain untuk proyek skala ini. Semua variabel warna dan spacing terdefinisi di satu tempat — tidak ada konflik nama, tidak ada scoping yang membingungkan.

---

## Arsitektur kode

### Dua fase utama

Aplikasi punya dua fase yang dikelola oleh `studio.tsx`:

```
┌─────────────────────────────────────────────────────────────────┐
│                         FASE 1: CAPTURE                         │
│                                                                 │
│  Kamera ──→ capturePhoto() ──→ session.photos[]                 │
│  Upload ──→ readPhotoFile() ──→ session.photos[]                │
│                                                                 │
│  Saat semua slot penuh → tombol "Edit" aktif                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ studio.edit()
                               │ buat Composition dari session
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         FASE 2: EDIT                            │
│                                                                 │
│  Composition ──→ Editor ──→ renderComposition() ──→ Fabric.js   │
│                                                                 │
│  Setiap perubahan (tema/stiker/teks/filter) → render ulang      │
└──────────────────────────────┬──────────────────────────────────┘
                               │ onExport()
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                           EKSPOR                                │
│                                                                 │
│  StaticCanvas baru → renderComposition() → toDataURL() → unduh  │
│  (kanvas tidak terlihat, terpisah dari editor)                   │
└─────────────────────────────────────────────────────────────────┘
```

### Alur data

```
page.tsx
  └── Studio
        ├── useCamera()           ← akses webcam
        ├── useCaptureSession()   ← mengelola session.photos[]
        │     └── sessionReducer  ← state machine foto (capture/retake/reset)
        ├── useThemeCatalog()     ← fetch /api/themes, merge dengan built-in
        ├── useExport()           ← handle download
        └── Editor (lazy load, SSR disabled)
              ├── useEditorCanvas()   ← Fabric canvas, resize observer
              ├── history.ts          ← undo/redo stack
              └── Panel-panel: ThemePanel, PhotoPanel, StickerPanel,
                              TextPanel, PropertyPanel
```

### Tipe data inti

**`Session`** — state fase capture:

```typescript
{
  templateId: TemplateId   // layout yang dipilih
  photos: string[]         // data URL JPEG tiap foto
  retakeIndex: number | null  // null = tidak sedang retake
}
```

**`Composition`** — paket lengkap untuk editor dan renderer:

```typescript
{
  template: Template          // geometri layout
  photos: string[]            // data URL foto
  themeId: string             // ID tema aktif
  stickers: StickerPlacement[]  // posisi, ukuran, rotasi tiap stiker
  texts: TextPlacement[]      // posisi, style tiap teks
  photoFilters: PhotoFilterId[] // filter per foto, sejajar dengan photos[]
}
```

> **Penting:** `Composition` selalu dibuat baru (immutable). Tidak ada mutation langsung.

### Layer rendering

Ketika `renderComposition()` dipanggil, lapisan digambar berurutan dari bawah ke atas:

```
8. Teks
7. Stiker
6. Logo PhotoPip (di area footer bawah)
5. Artwork paket tema (PNG transparan di atas foto)
4. Garis tepi slot bingkai
3. Foto (dipotong cover-crop agar memenuhi slot)
2. Bingkai preset (opsional, dari tema)
1. Latar (warna solid / gradasi / pola)
```

**Renderer yang sama** dipakai untuk pratinjau editor dan hasil ekspor — sehingga "apa yang kamu lihat = apa yang diunduh."

### Paket tema — alur server

```
GET /api/themes
  └── scanThemeDirectory()
        ├── validasi ID folder (lowercase, angka, tanda hubung)
        ├── baca theme.json (opsional)
        ├── validasi 5 PNG artwork (ukuran piksel harus tepat)
        └── kembalikan ThemePackResponse ke browser

Browser
  └── useThemeCatalog()
        ├── fetch /api/themes
        └── mergeThemePacks(builtins, packs) → ThemePreset[]
```

---

## Struktur folder

```
PhotoPip/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Kerangka HTML: metadata, font lokal, ThemeProvider, LanguageProvider, Header
│   │   ├── page.tsx            ← Halaman "/" — hanya render <Studio />
│   │   ├── globals.css         ← SATU-SATUNYA file CSS: semua variabel, komponen, layout, responsif
│   │   └── api/themes/
│   │       ├── route.ts        ← Next.js route handler: GET /api/themes
│   │       └── scan.ts         ← Membaca dan memvalidasi folder theme-packs di server
│   │
│   ├── components/
│   │   ├── header.tsx          ← App bar: logo, pilih bahasa, toggle gelap/terang
│   │   ├── icons.tsx           ← Semua ikon SVG inline (18 ikon, hand-drawn style)
│   │   └── theme-provider.tsx  ← Wrapper tipis di atas next-themes
│   │
│   ├── features/
│   │   ├── studio/             ← FASE 1: semua yang terjadi sebelum editor
│   │   │   ├── studio.tsx      ← Komponen utama: state phase, session, layout picker
│   │   │   ├── types.ts        ← StudioMessage union type
│   │   │   ├── camera/
│   │   │   │   ├── use-camera.ts       ← Hook kamera: start/stop/capture/status
│   │   │   │   └── camera-utils.ts     ← Fungsi utils: frame check, error type, capture
│   │   │   ├── hooks/
│   │   │   │   ├── use-capture-session.ts  ← Countdown, flash, dispatch ke session reducer
│   │   │   │   ├── use-export.ts           ← Download PNG/JPEG, lazy-load export.ts
│   │   │   │   └── use-theme-catalog.ts    ← Fetch /api/themes, merge themes
│   │   │   └── components/
│   │   │       ├── booth-stage.tsx      ← Area video kamera + status kosong + countdown
│   │   │       ├── capture-controls.tsx ← Tombol shutter, timer, mirror, upload, review
│   │   │       ├── export-bar.tsx       ← Pilih format + tombol Download
│   │   │       ├── feedback.tsx         ← Toast error/sukses
│   │   │       ├── film-strip.tsx       ← Grid thumbnail foto + tombol retake
│   │   │       └── template-selector.tsx ← Dropdown/bottom-sheet pilih layout
│   │   │
│   │   └── editor/             ← FASE 2: editor Fabric.js
│   │       ├── editor.tsx      ← Komponen utama editor: toolbar, zoom, panel, undo/redo
│   │       ├── types.ts        ← ToolTab union type
│   │       ├── history.ts      ← Undo/redo stack (max 40 entry, immutable)
│   │       ├── tabs.ts         ← Keyboard navigation tablist
│   │       ├── hooks/
│   │       │   └── use-editor-canvas.ts  ← Inisialisasi Fabric, resize, event commit
│   │       └── components/
│   │           ├── tool-rail.tsx        ← Tab navigasi panel (Theme/Photo/Sticker/Text/Properties)
│   │           ├── theme-panel.tsx      ← Grid kartu tema + tombol Surprise
│   │           ├── theme-preview.tsx    ← Miniatur pratinjau tema (CSS scale)
│   │           ├── photo-panel.tsx      ← Pilih foto aktif, terapkan filter, retake
│   │           ├── sticker-panel.tsx    ← Cari stiker, filter kategori, tambah ke kanvas
│   │           ├── text-panel.tsx       ← Daftar teks, tambah teks baru
│   │           ├── property-panel.tsx   ← Inspector properti objek terpilih + layer list
│   │           ├── sticker-inspector.tsx ← Kontrol posisi, ukuran, rotasi, opacity, flip
│   │           ├── text-inspector.tsx   ← Kontrol teks, font, warna, align, bold, italic
│   │           ├── number-field.tsx     ← Range slider + number input (komponen reusable)
│   │           └── layer-list.tsx       ← Daftar semua stiker dan teks (urutan layer)
│   │
│   ├── shared-tools/
│   │   ├── catalog/
│   │   │   ├── templates.ts    ← 5 definisi layout (id, name, photoCount, aspectRatio, layout)
│   │   │   ├── themes.ts       ← ThemePreset type, themeById(), applyTheme(), activeTheme()
│   │   │   ├── theme-ids.ts    ← ID built-in (saat ini kosong — semua tema dari theme-packs)
│   │   │   ├── theme-pack.ts   ← Kontrak folder tema: parsing, validasi PNG, URL cache-bust
│   │   │   ├── theme-packs.ts  ← packToThemePreset(), mergeThemePacks()
│   │   │   ├── stickers.ts     ← 15 stiker SVG inline sebagai data URL
│   │   │   ├── photo-filters.ts ← Definisi 6 filter + preview CSS approximation
│   │   │   └── fonts.ts        ← 5 font stack + resolveTextFont()
│   │   ├── composition/
│   │   │   ├── types.ts        ← Composition, StickerPlacement, TextPlacement, Slot, PhotoFilterId
│   │   │   ├── geometry.ts     ← templateGeometry(), fitCanvas(), coverCrop(), normalizeSticker()
│   │   │   ├── render.ts       ← renderComposition() — satu renderer untuk editor dan ekspor
│   │   │   ├── export.ts       ← exportComposition() → toDataURL, downloadImage()
│   │   │   ├── background-fill.ts ← Latar: color / Gradient / Pattern (Fabric objects)
│   │   │   └── text.ts         ← normalizeText() — clamp posisi, ukuran, opacity teks
│   │   ├── session.ts          ← Session type + sessionReducer (capture/retake/reset)
│   │   ├── image-upload.ts     ← readPhotoFile(): validasi, scale ≤ 2000px, JPEG 0.92
│   │   └── async.ts            ← delay(ms, signal) — setTimeout yang bisa di-abort
│   │
│   ├── translations/
│   │   ├── types.ts            ← Language list, Messages interface (semua kunci UI)
│   │   ├── index.ts            ← Registry semua locale, defaultLanguage, isLanguage()
│   │   ├── use-language.tsx    ← LanguageProvider + useLanguage() hook + localStorage
│   │   └── locales/
│   │       ├── id.ts  ← Indonesia (default)
│   │       ├── en.ts  ← English
│   │       ├── es.ts  ← Español
│   │       ├── fr.ts  ← Français
│   │       ├── de.ts  ← Deutsch
│   │       ├── ja.ts  ← 日本語
│   │       └── zh.ts  ← 中文
│   │
│   └── assets/fonts/
│       └── google-sans-flex-latin.woff2  ← Font self-hosted (tidak ada request ke Google)
│
├── public/
│   ├── assets/
│   │   ├── app-icons/      ← Favicon, Apple touch icon
│   │   ├── brand/logo.png  ← Logo yang muncul di footer strip hasil cetakan
│   │   └── theme-packs/    ← DROP folder tema kamu di sini
│   │       ├── _starter/   ← Panduan (folder _ diabaikan oleh scanner)
│   │       └── <nama-tema>/  ← Contoh tema yang sudah ada
│   └── manifest.json       ← Web App Manifest (PWA metadata)
│
├── tests/
│   ├── camera.test.tsx          ← Tes use-camera: status, abort, cleanup
│   ├── capture-session.test.tsx ← Tes sessionReducer: capture, retake, reset
│   ├── composition.test.ts      ← Tes geometry, coverCrop, normalizeSticker/Text
│   ├── editor-tabs.test.ts      ← Tes keyboard navigation tablist
│   ├── theme-catalog.test.ts    ← Tes mergeThemePacks, useThemeCatalog
│   ├── theme-pack.test.ts       ← Tes validasi folder tema (PNG size, manifest, ID)
│   └── theme-preview.test.tsx   ← Tes render ThemePreview komponen
│
└── scripts/
    ├── audit-production.mjs    ← npm audit hanya untuk dependency produksi
    └── package-standalone.mjs  ← Menyalin public/ ke .next/standalone/ setelah build
```

---

## Setup dan instalasi

### Prasyarat

- **Node.js 22 atau lebih baru** — unduh di [nodejs.org](https://nodejs.org) (pilih LTS)
- **npm 11** — sudah disertakan bersama Node.js

Cek versi:

```bash
node --version   # harus v22.x.x atau lebih baru
npm --version    # harus 11.x.x
```

### Instalasi

```bash
# 1. Clone atau download kode
git clone <url-repositori>
cd PhotoPip

# 2. Install semua dependency
npm install

# 3. Jalankan dev server
npm run dev
```

Buka `http://localhost:3000` di browser. Biarkan terminal tetap berjalan.

> **Catatan:** Folder `node_modules/` dan `.next/` tidak ada di GitHub karena masuk `.gitignore`. Keduanya dibuat ulang oleh `npm install` dan `npm run build`.

### Variabel lingkungan (opsional)

| Variabel               | Default                 | Keterangan                         |
| ---------------------- | ----------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | URL dasar untuk metadata OpenGraph |
| `PORT`                 | `3000`                  | Port server (untuk `npm start`)    |

---

## Perintah yang tersedia

Semua perintah dijalankan dari folder utama proyek.

| Perintah                   | Fungsi                                                                    |
| -------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`              | Dev server dengan Turbopack di `localhost:3000`                           |
| `npm run build`            | Build produksi + kemas ke `.next/standalone/`                             |
| `npm start`                | Jalankan server standalone (butuh build dulu)                             |
| `npm test`                 | Jalankan semua tes sekali                                                 |
| `npm run type-check`       | Periksa tipe TypeScript tanpa build                                       |
| `npm run lint`             | ESLint — 0 warning diizinkan                                              |
| `npm run format`           | Prettier write (format semua file)                                        |
| `npm run format:check`     | Prettier check tanpa mengubah file                                        |
| `npm run deadcode`         | Knip — cari file/export/dependency tidak terpakai                         |
| `npm run audit:production` | Cek kerentanan dependency produksi saja                                   |
| `npm run verify`           | **Gate lengkap**: format → types → lint → test → deadcode → audit → build |

> Sebelum menganggap perubahan selesai, selalu jalankan `npm run verify`.

---

## Fitur lengkap

### Tata letak cetak (5 pilihan)

| ID    | Nama         | Ukuran cetak | Foto | Susunan          | Kanvas internal |
| ----- | ------------ | ------------ | ---- | ---------------- | --------------- |
| `4x1` | Strip Klasik | 2″ × 6″      | 4    | 1 kolom vertikal | 600 × 1800 px   |
| `3x1` | Strip Tiga   | 2″ × 4,5″    | 3    | 1 kolom vertikal | 600 × 1350 px   |
| `2x3` | Grid 2×3     | 4″ × 6″      | 6    | 2 kolom, 3 baris | 1200 × 1800 px  |
| `2x2` | Grid Persegi | 4″ × 4″      | 4    | 2 kolom, 2 baris | 1200 × 1200 px  |
| `1x1` | Satu Foto    | 4″ × 6″      | 1    | Satu foto besar  | 1200 × 1800 px  |

Geometri slot dihitung otomatis dari lebar kanvas:

- **Margin luar:** 4,5% lebar
- **Jarak antar slot:** 2,5% lebar
- **Footer logo:** 12% lebar (area bawah untuk logo PhotoPip)

### Kamera

- Meminta video depan (`facingMode: "user"`), resolusi ideal 1280 × 960, tanpa audio
- Menunggu frame pertama tersedia (maksimal 10 detik)
- Otomatis berhenti saat: tab disembunyikan, navigasi keluar, retake, atau masuk editor

**Status kamera:**
| Status | Arti |
|--------|------|
| `off` | Belum diminta |
| `requesting` | Meminta izin / memuat stream |
| `ready` | Stream aktif, siap ambil foto |
| `error` | Gagal — lihat kode error |

**Kode error kamera:**
| Kode | Penyebab |
|------|----------|
| `denied` | Izin ditolak pengguna atau kebijakan browser |
| `missing` | Tidak ada kamera yang cocok |
| `busy` | Kamera dipakai aplikasi lain |
| `readiness` | Stream ada tapi tidak menghasilkan frame dalam batas waktu |
| `capture` | Gagal membaca frame saat jepret |
| `unavailable` | Error lain yang tidak dikenali |

### Upload foto

- Format yang diterima: `avif`, `bmp`, `gif`, `heic`, `heif`, `jpg`, `jpeg`, `png`, `webp`
- Dikecilkan otomatis: sisi terpanjang maksimal **2000 px**
- Latar transparan diratakan ke **putih** (agar kompatibel dengan JPEG)
- Disimpan sebagai **JPEG kualitas 0,92** di memori browser
- Saat retake: hanya 1 file yang dipakai

### Filter foto (6 jenis)

Filter diterapkan via Fabric.js di renderer, bukan CSS:

| ID        | Efek Fabric                                            |
| --------- | ------------------------------------------------------ |
| `none`    | Tanpa filter                                           |
| `bw`      | `Grayscale()`                                          |
| `warm`    | `BlendColor(#ffb37a, tint, 0.18)` + `Brightness(0.03)` |
| `cool`    | `BlendColor(#7ab8ff, tint, 0.18)`                      |
| `vintage` | `Vintage()`                                            |
| `fade`    | `Saturation(-0.35)` + `Brightness(0.08)`               |

### Stiker (15 bawaan)

Semua stiker adalah SVG yang di-embed langsung sebagai data URL — tidak ada request ke internet:

`sunglasses` · `mustache` · `crown` · `heart` · `star` · `bowtie` · `speechBubble` · `hat` · `glasses` · `wink` · `rainbow` · `peace` · `lightning` · `diamond` · `unicorn`

Stiker bisa dicari dengan teks atau difilter per kategori (Fun, Love, Cool, Fancy).

### Teks

- Font yang tersedia: `app` (font halaman), `serif` (Georgia), `sans` (Arial), `mono` (Courier New), `display` (Impact)
- Ukuran minimum: 18 px cetak
- Panjang maksimal: 120 karakter
- Properti: posisi x/y, ukuran, rotasi, opacity, warna, font, align (kiri/tengah/kanan), bold, italic
- Teks kosong tidak digambar di ekspor

### Undo / Redo

- Stack `past[]` dan `future[]` — masing-masing maksimal **40 entry**
- Setiap `Composition` di stack adalah snapshot immutable
- Gesture slider (drag range input) hanya buat 1 undo-step per gesture, bukan per piksel

### Ekspor

- Format: **PNG** (lossless) atau **JPEG** (kualitas 0,95)
- Resolusi: persis ukuran kanvas internal (misalnya 600 × 1800 px untuk 4x1)
- Nama file: `photopip-<timestamp>.png` atau `.jpg`
- Proses: `StaticCanvas` Fabric dibuat di memori → render → `toDataURL()` → download link diklik programatik → canvas dibuang
- Ekspor **tidak** bergantung pada kanvas editor — keduanya independen

---

## Paket tema — cara membuat sendiri

Buat folder di `public/assets/theme-packs/<id-tema>/` lalu tambahkan file PNG.

### Aturan penamaan folder

- Hanya huruf kecil (`a-z`), angka (`0-9`), dan tanda hubung (`-`)
- Tidak boleh diawali atau diakhiri dengan tanda hubung
- Maksimal **40 karakter**
- Contoh valid: `cherry-blossom`, `retro80s`, `pastel2024`
- Folder yang diawali `_` atau `.` diabaikan oleh scanner

### File yang wajib ada (5 PNG)

Tiap file harus **tepat** dimensinya — scanner akan menolak kalau ukurannya salah.

| File         | Ukuran (px) | Untuk template |
| ------------ | ----------- | -------------- |
| `4x1.png`    | 600 × 1800  | Strip 4 foto   |
| `3x1.png`    | 600 × 1350  | Strip 3 foto   |
| `2x3.png`    | 1200 × 1800 | Grid 2×3       |
| `2x2.png`    | 1200 × 1200 | Grid 2×2       |
| `single.png` | 1200 × 1800 | Satu foto      |

> **Penting:** Nama file untuk satu foto adalah `single.png`, **bukan** `1x1.png`. Browser ad-blocker bisa memblokir file bernama `1x1.png` karena dikira tracking pixel.

### Desain artwork

Artwork adalah **lapisan transparan di atas foto**. Area transparan memperlihatkan foto di bawahnya; area berwarna menutupi atau mendekorasi.

Posisi slot foto di tiap canvas (koordinat `x, y, lebar, tinggi` dalam px):

<details>
<summary>Lihat koordinat slot tiap template</summary>

**`4x1.png` (600 × 1800):**

- Slot 1: `27, 27, 546, 407`
- Slot 2: `27, 449, 546, 407`
- Slot 3: `27, 872, 546, 407`
- Slot 4: `27, 1294, 546, 407`

**`3x1.png` (600 × 1350):**

- Slot 1: `27, 27, 546, 398`
- Slot 2: `27, 440, 546, 398`
- Slot 3: `27, 853, 546, 398`

**`2x3.png` (1200 × 1800):**

- Slot 1: `54, 54, 531, 496`
- Slot 2: `615, 54, 531, 496`
- Slot 3: `54, 580, 531, 496`
- Slot 4: `615, 580, 531, 496`
- Slot 5: `54, 1106, 531, 496`
- Slot 6: `615, 1106, 531, 496`

**`2x2.png` (1200 × 1200):**

- Slot 1: `54, 54, 531, 459`
- Slot 2: `615, 54, 531, 459`
- Slot 3: `54, 543, 531, 459`
- Slot 4: `615, 543, 531, 459`

**`single.png` (1200 × 1800):**

- Slot 1: `54, 54, 1092, 1548`

</details>

### File opsional

**`preview.png`** — gambar cover untuk kartu tema di editor.

- Ukuran: 64 × 64 px hingga 2048 × 2048 px
- Disarankan persegi (non-persegi akan di-crop)
- Disarankan di bawah 1 MB

**`theme.json`** — metadata tema (maksimal 16 KB):

```json
{
  "name": "Nama Temamu",
  "textColor": "#20231f",
  "fontId": "app",
  "backgroundColor": "#ffffff"
}
```

| Field             | Default     | Keterangan                                     |
| ----------------- | ----------- | ---------------------------------------------- |
| `name`            | Nama folder | Nama tampilan, 1–60 karakter                   |
| `textColor`       | `#20231f`   | Warna teks default (`#rrggbb`)                 |
| `fontId`          | `app`       | `app`, `serif`, `sans`, `mono`, atau `display` |
| `backgroundColor` | `#ffffff`   | Warna latar solid (`#rrggbb`)                  |

### Cara debug

Buka `/api/themes` di browser saat dev server berjalan. Response berisi:

- `themes` — daftar tema yang berhasil dimuat
- `diagnostics` — daftar error/warning per folder

---

## Panduan pengembang

### Aturan wajib

| Aturan                                                                            | Kenapa                                                                                   |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Jalankan `npm run verify` sebelum selesai                                         | Satu perintah yang cek semua                                                             |
| Perubahan visual wajib masuk `render.ts`                                          | Editor dan ekspor pakai renderer yang sama — kalau hanya ubah editor, hasil unduhan beda |
| `Composition`, `Session`, dan catalog entry tidak boleh di-mutasi                 | State immutable mencegah bug re-render yang sulit dilacak                                |
| Semua string UI harus masuk ke 7 locale                                           | Hardcode teks bahasa apapun di komponen = bug i18n                                       |
| Jangan import `window`, `document`, `navigator` di kode yang bisa dirender server | Next.js merender beberapa bagian di server Node.js                                       |
| Operasi async baru harus bisa di-abort                                            | Pakai `AbortController` + `AbortSignal`, cleanup timer/listener di return effect         |
| Satu file CSS — tidak ada Tailwind, CSS module, atau CSS-in-JS                    | Menjaga konsistensi sistem desain                                                        |
| Jangan gunakan `// eslint-disable` atau `@ts-ignore` untuk menyembunyikan error   | Perbaiki akar masalahnya                                                                 |

### Menambah tata letak baru

1. Tambah entry ke `src/shared-tools/catalog/templates.ts`
2. Tambah `layoutNames` ke semua 7 locale di `src/translations/locales/`
3. Semua paket tema yang sudah ada harus ditambahkan file PNG untuk template baru
4. Update tabel di README ini

### Menambah stiker baru

1. Buat SVG inline dengan `viewBox="0 0 100 100"` (ukuran intrinsik dibutuhkan agar canvas bisa render)
2. Tambah ke `stickerSvgs` di `src/shared-tools/catalog/stickers.ts` via `svgDataUrl()`
3. Tambah entry ke array `stickers` dengan `id`, `name`, dan `tags`
4. Pastikan ID unik

### Menambah filter baru

1. Tambah ID ke union `PhotoFilterId` di `src/shared-tools/composition/types.ts`
2. Tambah case ke `applyPhotoFilter()` di `render.ts` (efek Fabric yang sesungguhnya)
3. Tambah entry ke `photoFilters` di `src/shared-tools/catalog/photo-filters.ts` (preview CSS)
4. Tambah key `filterNames.<id>` ke semua 7 locale

### Menambah bahasa baru

1. Tambah kode bahasa ke `languages` array di `src/translations/types.ts`
2. Buat file `src/translations/locales/<kode>.ts` yang memenuhi interface `Messages`
3. Tambah ke `messages` object di `src/translations/index.ts`
4. Tambah ke `languageNames` di `src/translations/types.ts`

---

## Pengujian

Tes ada di folder `tests/`, dijalankan dengan Vitest + jsdom.

```bash
npm test                                    # semua tes
npx vitest run tests/camera.test.tsx        # satu file
npx vitest --watch                          # watch mode
```

### Cakupan tes

| File tes                   | Yang diuji                                                           |
| -------------------------- | -------------------------------------------------------------------- |
| `camera.test.tsx`          | Status kamera, penanganan error, abort, cleanup stream               |
| `capture-session.test.tsx` | `sessionReducer`: capture, retake, reset, batas slot                 |
| `composition.test.ts`      | `templateGeometry`, `coverCrop`, `normalizeSticker`, `normalizeText` |
| `editor-tabs.test.ts`      | `nextTabIndex`: navigasi keyboard Arrow/Home/End                     |
| `theme-catalog.test.ts`    | `mergeThemePacks`, `useThemeCatalog` hook                            |
| `theme-pack.test.ts`       | Validasi folder tema: PNG size, manifest JSON, ID format             |
| `theme-preview.test.tsx`   | Render komponen `ThemePreview`                                       |

> **Tes tidak menjamin:** hasil visual, kualitas cetak, atau perilaku kamera di hardware nyata.

---

## Pemecahan masalah

### Kamera tidak menyala

- Pastikan halaman dibuka lewat **HTTPS** atau **`http://localhost`**
- Periksa izin kamera di browser (ikon kunci di address bar)
- Pastikan tidak ada aplikasi lain yang sedang memakai kamera (Zoom, Meet, dll.)
- Cek kode error yang muncul di UI — lihat tabel kode error kamera di atas

### Paket tema tidak muncul di editor

1. Buka `http://localhost:3000/api/themes` — lihat bagian `diagnostics`
2. Pastikan 5 file PNG ada dan ukurannya **tepat** (cek tabel ukuran di atas)
3. Pastikan nama folder: huruf kecil, angka, tanda hubung saja, tidak mulai dengan `_` atau `.`
4. Pastikan `theme.json` valid (JSON benar, nilai field sesuai aturan)
5. Muat ulang halaman setelah menambah atau mengubah paket

### Stiker atau teks tidak muncul di hasil unduhan

- Pastikan `renderComposition()` di `render.ts` sudah di-update — editor dan ekspor pakai fungsi yang sama
- Cek console browser untuk error gambar yang gagal dimuat

### Editor kosong atau "Processing..." terus

- Cek console untuk error Fabric
- Pastikan container `.canvas-wrap` punya ukuran lebih dari 0 (tidak tersembunyi)
- Cek apakah ada error saat `renderComposition()` dipanggil

### Font terlihat berbeda dari ekspektasi

- Font self-hosted Google Sans Flex ada di `src/assets/fonts/`
- Jangan ganti ke font dari URL eksternal tanpa testing — bisa menyebabkan font belum siap saat ekspor

### Aset 404 di server standalone

- Jalankan `npm run build` dulu — skrip `package-standalone.mjs` menyalin `public/` ke folder standalone
- Baru jalankan `npm start`

### Halaman refresh, foto hilang

Ini memang by design — tidak ada penyimpanan permanen. Unduh dulu sebelum meninggalkan halaman.

---

## Kontribusi

Kontribusi disambut! Berikut panduannya:

1. **Fork** repositori ini
2. **Buat branch** untuk fitur atau fix kamu: `git checkout -b fitur/nama-fitur`
3. **Buat perubahan** — ikuti aturan pengembangan di atas
4. **Jalankan gate:** `npm run verify` harus lolos penuh
5. **Commit** dengan pesan yang jelas
6. **Buat Pull Request** — deskripsikan apa yang berubah dan kenapa

### Yang perlu diperhatikan saat PR

- Semua string UI baru harus ada di **7 locale**
- Perubahan visual harus mengubah `render.ts`, bukan hanya komponen editor
- Jangan tambahkan dependency baru tanpa diskusi dulu — evaluasi ukuran, lisensi, keamanan
- Satu PR satu tujuan — lebih mudah di-review

---

## Hal yang belum tersedia

PhotoPip saat ini belum punya fitur berikut — butuh keputusan produk tersendiri jika ingin ditambahkan:

- Penyimpanan foto permanen (database, cloud)
- Akun pengguna / login
- Server upload foto
- Berbagi hasil lewat tautan
- Hapus atau susun ulang foto satu per satu secara bebas
- Crop/pan manual di dalam slot
- Upload foto via drag-and-drop
- Gestur pinch/zoom di mobile

---

## Lisensi font

Font **Google Sans Flex** digunakan dengan lisensi [SIL Open Font License (OFL)](https://scripts.sil.org/OFL). File lisensi ada di `src/assets/fonts/`. Pertahankan file lisensi saat mendistribusikan ulang.
