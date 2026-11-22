# PhotoPip

PhotoPip adalah photo booth yang jalan di browser. Ambil foto pakai kamera laptop atau HP, susun jadi strip seperti hasil photo booth di mal, tempel bingkai dan stiker, lalu unduh sebagai gambar siap cetak.

Tidak perlu install apa pun, dan tidak perlu akun. Fotonya juga tidak pernah dikirim ke mana-mana, karena semua pemrosesan terjadi di dalam tab browser kamu.

Server cuma dipakai untuk dua hal kecil: memberi daftar bingkai dan daftar stiker yang tersedia. Itu saja.

---

## Daftar isi

- [Cara membaca README ini](#cara-membaca-readme-ini)
- [Mau pakai situsnya saja? Mulai dari sini](#mau-pakai-situsnya-saja-mulai-dari-sini)
- [Mau jalankan sendiri di komputer? Mulai dari sini](#mau-jalankan-sendiri-di-komputer-mulai-dari-sini)
  - [Langkah 1: Install Node.js](#langkah-1-install-nodejs)
  - [Langkah 2: Download kode ini](#langkah-2-download-kode-ini)
  - [Langkah 3: Install dependency](#langkah-3-install-dependency)
  - [Langkah 4: Jalankan](#langkah-4-jalankan)
- [Perintah yang tersedia](#perintah-yang-tersedia)
- [Privasi dan penyimpanan data](#privasi-dan-penyimpanan-data)
- [Keamanan dan header HTTP](#keamanan-dan-header-http)
- [Semua fitur yang ada](#semua-fitur-yang-ada)
- [Perilaku di ponsel](#perilaku-di-ponsel)
- [Bagaimana kode ini bekerja](#bagaimana-kode-ini-bekerja)
  - [Dua fase: Capture dan Edit](#dua-fase-capture-dan-edit)
  - [Istilah yang dipakai](#istilah-yang-dipakai)
  - [Baca kode dalam 10 menit](#baca-kode-dalam-10-menit)
  - [Jejak satu foto: dari klik sampai unduh](#jejak-satu-foto-dari-klik-sampai-unduh)
  - [Struktur data penting](#struktur-data-penting)
  - [Urutan lapisan gambar](#urutan-lapisan-gambar)
  - [Pohon komponen](#pohon-komponen)
  - [Bagaimana paket bingkai dan stiker dimuat](#bagaimana-paket-bingkai-dan-stiker-dimuat)
- [Tech stack](#tech-stack)
- [Peta folder dan file](#peta-folder-dan-file)
- [Cara membuat paket bingkai sendiri](#cara-membuat-paket-bingkai-sendiri)
- [Cara menambah stiker sendiri](#cara-menambah-stiker-sendiri)
- [Cara menambah atau mengubah bagian kode](#cara-menambah-atau-mengubah-bagian-kode)
- [Testing: cara menguji kode](#testing-cara-menguji-kode)
- [Pemecahan masalah umum](#pemecahan-masalah-umum)
- [Kontribusi](#kontribusi)
- [Lisensi aset](#lisensi-aset)

---

## Cara membaca README ini

README ini panjang, dan kamu tidak perlu membaca semuanya. Cari baris yang paling mirip dengan keadaanmu, lalu ikuti jalurnya.

| Kalau kamu…                                          | Baca ini                                                                                                                                                                                                                                   | Perkiraan waktu |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| Cuma mau bikin foto strip                            | [Mau pakai situsnya saja](#mau-pakai-situsnya-saja-mulai-dari-sini)                                                                                                                                                                        | 2 menit         |
| Mau bikin bingkai atau stiker sendiri, tanpa ngoding | [Cara membuat paket bingkai](#cara-membuat-paket-bingkai-sendiri) lalu [Cara menambah stiker](#cara-menambah-stiker-sendiri)                                                                                                               | 10 menit        |
| Mau menjalankan di komputer sendiri                  | [Mau jalankan sendiri](#mau-jalankan-sendiri-di-komputer-mulai-dari-sini)                                                                                                                                                                  | 15 menit        |
| Mau **memahami kode**                                | [Peta folder](#peta-folder-dan-file), lalu [Dua fase](#dua-fase-capture-dan-edit), [Istilah](#istilah-yang-dipakai), [Baca kode dalam 10 menit](#baca-kode-dalam-10-menit), dan [Jejak satu foto](#jejak-satu-foto-dari-klik-sampai-unduh) | 30–60 menit     |
| Mau **mengubah kode**                                | Jalur di atas, lalu [Cara menambah atau mengubah bagian kode](#cara-menambah-atau-mengubah-bagian-kode) dan [Testing](#testing-cara-menguji-kode)                                                                                          | -               |

Beberapa kebiasaan penulisan yang dipakai di sini:

- Semua path dihitung dari folder utama repo. `src/features/studio/studio.tsx` artinya file `studio.tsx` di dalam `src/features/studio/`.
- Tanda `←` cuma keterangan tambahan, bukan bagian dari kode.
- Blok kode berlabel `typescript` berisi bentuk data asli di repo, bukan karangan.
- Nama fungsi seperti `renderComposition()` bisa dicari langsung dengan `Ctrl + F`.

---

## Mau pakai situsnya saja? Mulai dari sini

> **[photopip.vercel.app](https://photopip.vercel.app)**

Buka link di atas. Tidak ada yang perlu di-install.

1. **Pilih tata letak.** Ada lima pilihan: strip 4 foto, strip 3 foto, grid 2×3, grid 2×2, dan satu foto besar. Ukurannya sudah disiapkan untuk cetak.
2. **Ambil foto atau upload.** Klik tombol kamera lalu izinkan browser memakai kamera. Kalau lebih suka pakai foto yang sudah ada, klik tombol upload dan pilih dari galeri.
3. **Isi semua slot.** Foto diambil satu per satu. Kalau ada yang kurang bagus, klik thumbnail-nya untuk jepret ulang. Foto lain tidak ikut terhapus.
4. **Tekan Edit.** Tombol ini baru aktif setelah semua slot terisi. Di editor kamu bisa ganti bingkai (warna latar dan font ikut menyesuaikan), menambah stiker lalu menggeser dan mengubah ukurannya, menulis teks, dan memasang filter berbeda untuk tiap foto.
5. **Unduh.** Pilih PNG atau JPEG, lalu klik Download.

Ada tiga hal yang sering bikin kaget di percobaan pertama:

- Kamera hanya jalan di halaman **HTTPS** atau `http://localhost`. Kalau dibuka lewat IP jaringan lokal seperti `http://192.168.x.x`, browser akan menolak.
- Refresh atau tutup tab, fotonya hilang. Unduh dulu sebelum pindah halaman.
- Semua foto dan hiasan cuma ada di memori browser. Tidak ada satu byte pun yang dikirim ke server.

---

## Mau jalankan sendiri di komputer? Mulai dari sini

Bagian ini untuk kamu yang mau membuka kodenya, mengubah sesuatu, atau mencoba tanpa internet.

Ikuti berurutan. Langkah 3 akan gagal kalau langkah 1 dilewati.

---

### Langkah 1: Install Node.js

PhotoPip ditulis dengan JavaScript, dan butuh Node.js supaya kodenya bisa jalan di komputermu. Anggap Node.js sebagai mesin yang menyalakan kode di luar browser.

1. Buka [nodejs.org](https://nodejs.org).
2. Klik tombol **LTS** (Long Term Support). Versi ini yang paling stabil.
3. Unduh installernya, jalankan, klik Next sampai selesai.
4. Buka terminal. Kalau belum pernah, lihat kotak di bawah langkah ini.
5. Cek apakah sudah terpasang:

```bash
node --version
```

Kalau keluar angka seperti `v22.11.0` atau lebih besar, beres. Sekarang cek npm, yang otomatis ikut terpasang bersama Node.js:

```bash
npm --version
```

Versi `11.x.x` ke atas aman dipakai.

> **Belum pernah pakai terminal?**
>
> - Windows: tekan `Windows + R`, ketik `cmd`, tekan Enter
> - Mac: buka Spotlight (`Cmd + Space`), ketik "Terminal"

---

### Langkah 2: Download kode ini

Ada dua cara. Pilih salah satu.

**Cara A, pakai Git (disarankan):**

Kalau [Git](https://git-scm.com) sudah terpasang:

```bash
git clone https://github.com/rafifnurfariz/Photopip.git
cd PhotoPip
```

**Cara B, download ZIP:**

1. Klik tombol hijau **Code** di halaman GitHub ini.
2. Klik **Download ZIP**.
3. Ekstrak ZIP ke folder yang kamu mau.
4. Buka terminal, lalu masuk ke folder hasil ekstrak:

```bash
cd path/ke/folder/PhotoPip
```

Ganti `path/ke/folder/PhotoPip` dengan lokasi folder yang sebenarnya di komputermu.

---

### Langkah 3: Install dependency

PhotoPip dibangun di atas kode buatan orang lain: React untuk tampilan, Fabric.js untuk kanvas, dan beberapa lainnya. Paket seperti itu disebut dependency.

Daftarnya ada di file `package.json`. Kamu tidak perlu mengunduh satu per satu, cukup minta npm mengambil semuanya.

Pastikan terminal sudah berada di dalam folder PhotoPip, lalu jalankan:

```bash
npm install
```

Proses ini butuh koneksi internet dan bisa makan beberapa menit. Setelah selesai akan muncul folder `node_modules/`, isinya semua dependency tadi.

> Kalau muncul error soal versi Node.js, cek lagi Langkah 1. PhotoPip butuh versi 22 atau lebih baru.

---

### Langkah 4: Jalankan

```bash
npm run dev
```

Tunggu sampai terminal menampilkan alamat lokal, kira-kira seperti ini:

```
▲ Next.js 16.4.5
- Local: http://localhost:3000
```

Buka `http://localhost:3000` di browser. PhotoPip siap dipakai.

Biarkan terminal tetap terbuka selama kamu memakai PhotoPip. Menutup terminal berarti mematikan servernya. Kalau mau berhenti dengan rapi, tekan `Ctrl + C`.

---

## Perintah yang tersedia

Semua perintah dijalankan dari folder utama PhotoPip.

| Perintah                   | Fungsi                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`              | Jalankan dev server di `localhost:3000` (untuk pengembangan)                             |
| `npm run build`            | Build versi produksi + kemas ke `.next/standalone/`                                      |
| `npm start`                | Jalankan server produksi (butuh `npm run build` dulu)                                    |
| `npm test`                 | Jalankan semua tes                                                                       |
| `npm run type-check`       | Periksa tipe TypeScript tanpa build                                                      |
| `npm run lint`             | Periksa kode dengan ESLint                                                               |
| `npm run format`           | Format semua file dengan Prettier                                                        |
| `npm run format:check`     | Periksa format tanpa mengubah file                                                       |
| `npm run deadcode`         | Cari file/export/dependency yang tidak terpakai                                          |
| `npm run audit:production` | Periksa celah keamanan di dependency produksi                                            |
| `npm run verify`           | **Jalankan semuanya sekaligus**: format → types → lint → test → deadcode → audit → build |

Sebelum menganggap sebuah perubahan selesai, jalankan `npm run verify`. Perintah ini menjalankan semuanya berurutan, jadi kalau ada satu yang gagal, kamu langsung tahu di mana masalahnya.

---

## Privasi dan penyimpanan data

PhotoPip tidak punya tempat untuk menyimpan foto, dan itu disengaja.

- **Foto tidak pernah keluar dari browser.** Semua pemrosesan terjadi di dalam tab, tidak ada upload ke server.
- Tidak ada database foto, tidak ada akun, tidak ada login.
- Server hanya punya dua endpoint read-only: `GET /api/frames` untuk membaca folder paket bingkai, dan `GET /api/stickers` untuk membaca folder stiker. Keduanya cuma mengirim data, tidak menerima apa pun.
- Yang tersimpan di browser hanya pilihan **bahasa** (key `photobooth-language`) dan **mode gelap atau terang** (dikelola `next-themes`). Dua-duanya lewat `localStorage`.
- Tutup atau refresh halaman, semua foto dan komposisi hilang.
- Folder `public/assets/` dibaca di server saat endpoint dipanggil, bukan di browser. Isi folder itu bukan data pengguna.

---

## Keamanan dan header HTTP

`next.config.mjs` memasang header keamanan untuk semua route. Tidak ada konfigurasi tambahan yang perlu kamu lakukan saat deploy.

| Header                    | Nilai                                                                                                                                          | Fungsi                                                                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Content-Security-Policy` | `default-src 'self'`, `img-src 'self' data: blob:`, `font-src 'self'`, `style-src 'self' 'unsafe-inline'`, `script-src 'self' 'unsafe-inline'` | Hanya izinkan aset dari origin sendiri, plus data URL/blob untuk foto di kanvas. Style inline tetap diizinkan karena Fabric menulis style di elemen kanvas. Di mode dev, `'unsafe-eval'` dan `ws:` ditambahkan agar HMR jalan. |
| `Permissions-Policy`      | `camera=(self), microphone=(), geolocation=()`                                                                                                 | Kamera hanya untuk origin ini; mikrofon dan lokasi diblokir total.                                                                                                                                                             |
| `X-Content-Type-Options`  | `nosniff`                                                                                                                                      | Browser tidak menebak tipe file.                                                                                                                                                                                               |
| `X-Frame-Options`         | `DENY`                                                                                                                                         | Halaman tidak bisa di-embed di iframe (anti clickjacking).                                                                                                                                                                     |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`                                                                                                              | Referrer tidak membocorkan path.                                                                                                                                                                                               |

Tiga catatan tambahan:

- Foto disimpan sebagai data URL di memori. Itu sebabnya CSP mengizinkan `data:` dan `blob:` untuk gambar.
- Kedua endpoint memakai `Cache-Control: no-store` dan `runtime = "nodejs"`, jadi selalu membaca isi folder terbaru.
- `/api/frames` hanya mengirim `diagnostics` saat `NODE_ENV === "development"`. Di produksi array-nya selalu kosong, dan path absolut server tidak pernah keluar.

---

## Semua fitur yang ada

### Tata letak cetak (5 pilihan)

| Nama         | Ukuran cetak | Jumlah foto | Susunan          |
| ------------ | ------------ | ----------- | ---------------- |
| Strip Klasik | 2″ × 6″      | 4 foto      | 1 kolom vertikal |
| Strip Tiga   | 2″ × 4,5″    | 3 foto      | 1 kolom vertikal |
| Grid 2×3     | 4″ × 6″      | 6 foto      | 2 kolom, 3 baris |
| Grid Persegi | 4″ × 4″      | 4 foto      | 2 kolom, 2 baris |
| Satu Foto    | 4″ × 6″      | 1 foto      | Satu foto besar  |

### Kamera

Kamera yang dipakai adalah kamera depan, resolusi ideal 1280 × 960.

- **Timer** pilihannya 0 detik (langsung), 3 detik, atau 5 detik.
- **Mirror** membalik gambar seperti selfie. Video dan hasil fotonya ikut terbalik.
- **Auto** mengisi semua slot tanpa kamu klik berkali-kali. Jepretan pertama memakai timer yang kamu pilih, jepretan berikutnya berjarak tetap 5 detik. Kamera mati sendiri setelah slot terakhir terisi. Tombol ini hanya muncul di tata letak dengan lebih dari satu foto.
- **Retake** mengganti satu foto saja, tanpa mengulang semuanya.
- **Upload** bisa menerima beberapa file sekaligus, tapi hanya kalau tata letaknya punya lebih dari satu slot.
- Kamera berhenti otomatis saat tab disembunyikan (`visibilitychange`) atau halaman ditinggalkan (`pagehide`).

Kalau kamera bermasalah, UI akan menampilkan salah satu kode ini:

| Kode          | Artinya                                                |
| ------------- | ------------------------------------------------------ |
| `denied`      | Kamu menolak izin kamera, atau browser memblokir akses |
| `missing`     | Tidak ada kamera yang terdeteksi                       |
| `busy`        | Kamera sedang dipakai aplikasi lain (Zoom, Meet, dll.) |
| `readiness`   | Stream kamera aktif tapi tidak menghasilkan gambar     |
| `capture`     | Gagal membaca frame saat jepret                        |
| `unavailable` | Error lain yang tidak dikenali                         |

### Upload foto

- Format yang diterima: AVIF, BMP, GIF, HEIC, HEIF, JPG, JPEG, PNG, WebP. Pengenalannya lewat MIME `image/*` atau ekstensi file.
- Ukuran maksimal **25 MB** per foto.
- Resolusi sumber dibatasi **40 megapiksel**, dan pengecekannya dilakukan sebelum gambar di-decode. File semacam "decompression bomb" langsung ditolak.
- Foto yang sisi terpanjangnya lebih dari **2000 px** akan dikecilkan otomatis.
- Latar transparan diratakan ke putih, lalu disimpan sebagai JPEG kualitas 0.92.
- Upload bersifat **all-or-nothing**. Kalau satu file dari pilihanmu ditolak, tidak ada foto yang masuk setengah-setengah.
- Jumlah file yang diambil dibatasi sisa slot kosong.

### Filter foto (6 jenis)

| Filter      | Efek                                    |
| ----------- | --------------------------------------- |
| Asli        | Tanpa perubahan                         |
| Hitam Putih | Grayscale penuh                         |
| Hangat      | Warna agak jingga/kuning                |
| Sejuk       | Warna agak biru                         |
| Vintage     | Efek foto lama                          |
| Pudar       | Saturasi berkurang, sedikit lebih cerah |

### Stiker

Stiker dibaca otomatis dari folder `public/assets/stickers/`. Sekarang ada 24 stiker dalam 5 kategori:

| Kategori | Jumlah |
| -------- | ------ |
| Cute     | 5      |
| Emoji    | 5      |
| Food     | 5      |
| Nature   | 4      |
| Y2K      | 5      |

Kategori dibuat dari nama subfolder, jadi menambah folder baru otomatis menambah tab baru. Stiker bisa dicari lewat kolom pencarian atau difilter per tab.

Setelah masuk ke kanvas, stiker bisa digeser, diubah ukuran, diputar, dibalik horizontal atau vertikal, dan diatur opacity-nya. Bisa juga digandakan, dibawa ke depan, atau dikirim ke belakang.

Stiker dari perangkat juga bisa diunggah lewat tombol di panel stiker. File itu tidak masuk folder `public/assets/stickers/` dan tidak dikirim ke server. Hasilnya data URL PNG di memori sesi, sama seperti foto. Batasnya 25 MB per file, sisi terpanjang dikecilkan ke 1200 px, dan transparansi PNG tetap utuh. File yang ditolak diabaikan tanpa pesan. Stiker unggahan hilang saat halaman di-refresh.

### Teks

Tulisan bisa ditambahkan ke foto dengan lima pilihan font: `app` (font halaman), `serif` (Georgia), `sans` (Arial), `mono` (Courier New), dan `display` (Impact). Warna, ukuran, rotasi, opacity, perataan, bold, dan italic semuanya bisa diatur.

Ada batas yang perlu diketahui: maksimal **120 karakter**, ukuran minimal **18 px**, posisi selalu dijepit di dalam kanvas, dan rotasi dinormalisasi ke 0–359°.

### Undo/Redo

Tombol undo dan redo di header editor bisa mundur sampai **40 langkah**.

Riwayat hanya bertambah saat ada perubahan sungguhan. Menggeser slider lalu mengembalikannya ke nilai awal, atau sekadar klik masuk lalu keluar dari sebuah field, tidak membuat langkah kosong.

Tidak ada shortcut keyboard untuk undo/redo. Keyboard hanya dipakai untuk navigasi tab: `←`, `→`, `Home`, dan `End`.

### Ekspor

- Formatnya **PNG** (lossless) atau **JPEG** (kualitas 95%).
- Resolusinya ukuran cetak penuh, bukan ukuran layar.
- Nama file: `photopip-<timestamp>.png` atau `.jpg`.
- Ekspor membuat `StaticCanvas` baru di luar layar, memanggil `renderComposition()` yang sama dengan editor, lalu mengambil hasilnya lewat `toDataURL()`.
- Kalau data URL yang dihasilkan tidak sesuai format yang diminta, ekspor dianggap gagal dan pengguna diberi pesan error.
- Ekspor bisa dibatalkan lewat `AbortController`, misalnya saat sesi direset.

---

## Perilaku di ponsel

Beberapa hal hanya aktif di layar kecil:

- **Tombol Back tidak membuang sesi.** Saat masuk editor di layar di bawah 900 px, aplikasi menambah satu entri history. Gestur back mengembalikanmu ke kamera dengan foto tetap utuh, bukan keluar dari halaman.
- **Editor bertumpuk.** Strip 1:3 yang dipaskan ke tinggi layar jadi terlalu sempit untuk diedit. Karena itu di ponsel editor membuat lebarnya pas dengan layar, lalu halaman bisa di-scroll vertikal.
- **Mode paskan ke layar.** Tombol fit di header editor membuat seluruh strip pas di layar, di kedua sumbu. Cocok untuk meninjau hasil tanpa scroll.
- **Pan satu jari.** Kanvas memakai `touch-action: none`. Drag yang dimulai di area kosong menggeser tampilan, sedangkan drag yang dimulai di atas objek tetap menggeser objeknya.
- **Pemilih tata letak jadi bottom sheet** di layar sempit dan portrait (lebar ≤ 640 px, tinggi ≥ 480 px). Di landscape tetap muncul sebagai popover biasa.
- **Toast unduhan** hilang sendiri setelah 3 detik.

---

## Bagaimana kode ini bekerja

Bagian ini untuk kamu yang mau membaca kodenya. Urutannya dibuat bertahap: lihat gambaran besar dulu, kenali nama-nama yang sering muncul, buka delapan file inti, lalu ikuti satu foto dari klik sampai unduh. Detail data dan urutan lapisan ada di bawahnya, jadi tidak perlu dihafal di awal.

Kalau waktumu cuma 10 menit, lompat langsung ke [Baca kode dalam 10 menit](#baca-kode-dalam-10-menit).

### Dua fase: Capture dan Edit

Ada dua fase besar, dan satu file yang mengatur perpindahannya: `studio.tsx`. Baca diagram ini dulu sebelum membuka file apa pun.

```
┌──────────────────────────────────────────────────────────┐
│                     FASE 1: CAPTURE                      │
│                                                          │
│  Kamera ──→ capturePhoto() ──→ session.photos[]          │
│  Upload ──→ readPhotoFile() ──→ session.photos[]         │
│                                                          │
│  Semua slot penuh → tombol "Edit" aktif                  │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                      FASE 2: EDIT                        │
│                                                          │
│  Composition → Editor → renderComposition() → Fabric.js  │
│                                                          │
│  Setiap perubahan (bingkai/stiker/teks/filter) → render  │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                        EKSPOR                            │
│                                                          │
│  StaticCanvas baru → renderComposition() → toDataURL()   │
│  → download link → canvas dibuang                        │
└──────────────────────────────────────────────────────────┘
```

Fase pertama mengumpulkan bahan. Foto dari kamera atau file yang kamu upload masuk ke `session.photos`. Begitu semua slot penuh, tombol Edit aktif.

Fase kedua mengolah bahan itu. `studio.edit()` membungkus sesi jadi `Composition`, lalu editor menampilkannya lewat `renderComposition()`. Setiap kali kamu mengubah sesuatu, fungsi render yang sama dipanggil lagi.

Ekspor ada di ujung rantai. Kanvas baru dibuat di luar layar, renderer yang sama dipanggil sekali lagi, lalu hasilnya diubah menjadi file. Karena renderer-nya sama, pratinjau dan hasil unduhan tidak mungkin berbeda.

### Istilah yang dipakai

Hampir semua kebingungan waktu membaca kode ini datang dari nama-nama yang mirip. Buka tabel ini setiap kali lupa.

| Istilah            | Artinya                                                                                                                                 | Didefinisikan di                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Session**        | State selama fase kamera: tata letak yang dipilih, foto yang sudah diambil, dan indeks retake.                                          | `src/shared-tools/session.ts`              |
| **Composition**    | Paket lengkap yang dirender: template, semua foto, bingkai, stiker, teks, dan filter. Ini yang disimpan editor dan dikirim ke renderer. | `src/shared-tools/composition/types.ts`    |
| **Template**       | Definisi tata letak: id, rasio, jumlah foto, jenis susunan. Tidak menyimpan foto.                                                       | `src/shared-tools/catalog/templates.ts`    |
| **FramePreset**    | Bentuk bingkai yang dipakai editor dan renderer: warna latar, artwork per template, warna teks, font.                                   | `src/shared-tools/catalog/frames.ts`       |
| **FramePackFrame** | Bentuk **mentah** bingkai hasil scan folder `frame-packs/`. Dikonversi ke `FramePreset` oleh `packToFramePreset()`.                     | `src/shared-tools/catalog/frame-pack.ts`   |
| **Slot**           | Satu kotak tempat foto digambar: `x`, `y`, `width`, `height` dalam piksel cetak.                                                        | `src/shared-tools/composition/geometry.ts` |
| **Placement**      | Satu stiker atau teks yang ditempatkan: posisi, ukuran, rotasi, opacity, dan properti lainnya.                                          | `src/shared-tools/composition/types.ts`    |
| **Renderer**       | Fungsi `renderComposition()` yang menggambar seluruh strip. Dipakai editor **dan** ekspor.                                              | `src/shared-tools/composition/render.ts`   |

Ada tiga aturan yang menjelaskan hampir semua keputusan desain di repo ini.

**Satu, `Session` dan `Composition` immutable.** Kode tidak pernah mengubah objek yang sudah ada. Setiap perubahan membuat objek baru. Kalau kamu menambah stiker, yang terjadi adalah salinan `Composition` dibuat, stiker dimasukkan ke salinan itu, lalu salinan tersebut menggantikan yang lama. Kebiasaan ini yang membuat undo/redo bisa dipercaya, karena versi lama tetap utuh dan bisa dikembalikan kapan saja.

**Dua, editor dan ekspor memakai satu renderer.** Fungsinya `renderComposition()`, dan cuma ada satu. Jadi yang terlihat di kanvas adalah yang akan terunduh.

**Tiga, foto hidup di memori sebagai data URL.** Tidak ada server, tidak ada database. Refresh berarti hilang.

Kalau kamu baru mulai belajar coding, beberapa kata umum ini akan muncul terus di dokumen ini. Tidak perlu dihafal sekarang, buka lagi saat menemukannya di kode.

| Kata      | Arti singkatnya                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------- |
| Komponen  | Potongan tampilan yang bisa dipakai berulang. Di React, bentuknya fungsi yang mengembalikan UI. |
| Props     | Nilai yang dikirim dari komponen induk ke komponen anak, mirip parameter fungsi.                |
| State     | Data yang bisa berubah, dan perubahannya membuat tampilan ikut diperbarui.                      |
| Hook      | Fungsi React berawalan `use` untuk menempelkan state atau efek samping ke komponen.             |
| Render    | Proses menggambar ulang tampilan dari data yang sedang dipegang.                                |
| Reducer   | Fungsi yang menerima state lama dan sebuah aksi, lalu mengembalikan state baru.                 |
| Immutable | Tidak diubah di tempat. Perubahan menghasilkan salinan baru, objek lama tetap utuh.             |
| Data URL  | Teks panjang yang isinya sudah berupa data gambar, jadi tidak butuh file terpisah.              |
| Endpoint  | Alamat URL di server yang mengembalikan data, misalnya `/api/frames`.                           |
| Cache     | Salinan sementara supaya sesuatu tidak diunduh atau dihitung ulang dari awal.                   |
| SSR       | Render di server. `ssr: false` berarti komponen itu hanya dirender di browser.                  |

### Baca kode dalam 10 menit

Delapan file ini cukup untuk memahami hampir seluruh aplikasi. Urutannya disusun supaya tiap file hanya butuh konteks dari file sebelumnya. Totalnya sekitar 1.600 baris, jadi sekali duduk selesai.

| #   | File                                             | Kenapa dibaca di sini                                                  |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | `src/shared-tools/composition/types.ts`          | Bentuk semua data. Hanya ~50 baris, selesai dalam 1 menit.             |
| 2   | `src/shared-tools/catalog/templates.ts`          | 5 tata letak yang mungkin. Menjelaskan `photoCount` dan `aspectRatio`. |
| 3   | `src/shared-tools/session.ts`                    | Reducer fase kamera: capture, retake, reset.                           |
| 4   | `src/features/studio/studio.tsx`                 | Pengatur dua fase. Perhatikan `Stage`, `edit()`, dan `leaveEdit()`.    |
| 5   | `src/shared-tools/composition/render.ts`         | Cara strip digambar, lapisan demi lapisan.                             |
| 6   | `src/features/editor/editor.tsx`                 | Semua aksi editor: tambah, ubah, duplikat, layer, undo.                |
| 7   | `src/features/editor/hooks/use-editor-canvas.ts` | Jembatan antara Fabric.js dan `Composition`.                           |
| 8   | `src/shared-tools/composition/export.ts`         | Ekspor: render ulang di kanvas terpisah, lalu unduh.                   |

Sisanya (komponen panel, ikon, file locale, scanner folder) hanya detail. Baca saat kamu benar-benar menyentuhnya.

### Jejak satu foto: dari klik sampai unduh

Bagian ini mengikuti satu foto dari awal sampai jadi file. Semua nama fungsi di bawah ada di kode, jadi bisa langsung dicari.

**1. Pilih tata letak**

`TemplateSelector` memanggil `onSelectTemplate(id)`, yang diteruskan ke `requestReset(id)` di `studio.tsx`. Kalau sudah ada foto, dialog konfirmasi muncul dulu. Setelah dikonfirmasi, `performReset()` menjalankan `resetSession(templateId)` dan reducer menerima `{ type: "reset" }`.

**2. Klik tombol jepret**

`CaptureControls` memanggil `onCapture(false)`, yang berujung ke `capture(false)` di `useCaptureSession`.

**3. Hitung mundur**

`capture()` menjalankan loop dan memanggil `delay(1000, signal)` dari `src/shared-tools/async.ts`. Angka di layar diperbarui lewat `setRemaining()`. Kalau tab disembunyikan, `AbortController` membatalkan loop ini di tengah jalan.

**4. Ambil gambar dari video**

`camera.capturePhoto(mirror)` memanggil `capturePhotoFromVideo()` di `camera-utils.ts`:

```text
<video> → <canvas> 2D → (opsional mirror) → toDataURL("image/jpeg", 0.95)
```

Hasilnya string `data:image/jpeg;base64,...`. String inilah isi `session.photos[]`.

**5. Simpan ke state**

`dispatch({ type: "capture", src, count })` dikirim ke `sessionReducer`, yang menambah foto baru. Kalau sedang retake, foto di `retakeIndex` yang diganti, bukan ditambah.

**6. Masuk editor**

Saat `photos.length === template.photoCount`, `complete` jadi `true`. Klik Edit, lalu `studio.edit()` membangun `Composition` pertama:

```typescript
{
  template,                                  // dari session.templateId
  photos: session.photos,
  frameId: "plain",
  stickers: [],
  texts: [],
  photoFilters: session.photos.map(() => "none"),
}
```

Setelah itu `setStage({ mode: "edit", draft })`. Komponen `Editor` di-lazy-load dengan `ssr: false`, karena Fabric.js hanya bisa jalan di browser.

Kalau `previous.draft` sudah ada (kamu pernah masuk editor lalu kembali ke kamera), `edit()` memakai draft itu lagi. Stiker dan teks tidak hilang, hanya `template` dan `photos` yang disegarkan.

**7. Kanvas menggambar strip**

`useEditorCanvas` membuat `new Fabric.Canvas(...)`, lalu memanggil `renderComposition(canvas, composition, frame, signal, true)`. Urutan kerjanya:

```text
validasi jumlah foto
  → muat semua gambar (dari cache LRU kalau ada, timeout 10 s)
  → tunggu document.fonts.ready
  → canvas.clear() + setDimensions(ukuran cetak)
  → gambar latar, foto, artwork bingkai, logo, stiker, teks
  → canvas.renderAll()
```

**8. Setiap edit mengulang langkah 7**

Panel memanggil `commit(nextComposition)`. `pushHistory()` menyimpan versi lama, `onChange()` di `studio.tsx` menyimpan draft baru, lalu `useEffect` di `useEditorCanvas` menjalankan `renderComposition()` lagi. Drag dan resize di kanvas menempuh jalur yang sama lewat event `object:modified`.

Khusus slider (posisi, ukuran, rotasi, opacity), panel memakai `beginGesture()` sebelum geser dan `endGesture()` setelah selesai. Jadi satu geseran utuh dihitung satu langkah undo, bukan puluhan.

**9. Unduh**

`ExportBar` memanggil `useExport().exportPhoto(composition, frame)`, yang mengimpor `export.ts` secara dinamis lalu menjalankan `exportComposition()`:

```text
StaticCanvas baru (di luar layar)
  → renderComposition()  ← fungsi yang sama dengan pratinjau
  → toDataURL(format, 0.95)
  → downloadImage() → <a download>.click()
  → canvas.dispose()
```

Karena renderer-nya sama, tidak ada kemungkinan "di editor terlihat bagus tapi hasil unduhan beda".

### Struktur data penting

**`Session`** menyimpan state selama fase kamera:

```typescript
{
  templateId: string;        // layout yang dipilih
  photos: string[];          // foto sebagai data URL JPEG
  retakeIndex: number | null; // null = tidak sedang retake
}
```

**`Composition`** adalah paket lengkap yang dipakai editor dan renderer:

```typescript
{
  template: Template;            // geometri layout (ukuran slot, posisi)
  photos: string[];              // data URL foto
  frameId: string;               // ID bingkai aktif
  stickers: StickerPlacement[];  // posisi, ukuran, rotasi tiap stiker
  texts: TextPlacement[];        // posisi, style tiap teks
  photoFilters: PhotoFilterId[]; // filter per foto
}
```

`Composition` tidak pernah diubah langsung. Setiap perubahan membuat objek baru, dan itu yang mencegah bug re-render yang susah dilacak.

**Aturan `sessionReducer`:**

- `capture` diabaikan kalau `photos` sudah penuh (`photos.length >= count`) atau `src` kosong.
- `capture` saat `retakeIndex` terisi akan mengganti foto di indeks itu, bukan menambah.
- `retake` diabaikan kalau indeksnya di luar rentang foto yang ada.
- `reset` mengosongkan foto tapi mempertahankan `templateId`, kecuali diberi nilai baru.

**Cara bingkai dipilih:**

- `frameById(id, frames)` mencari di katalog. Kalau tidak ketemu, ia jatuh ke objek `plain` yang identitasnya stabil, bukan objek baru tiap panggilan.
- `applyFrame()` mengganti `frameId` sekaligus menimpa warna dan font semua teks agar cocok dengan bingkai.
- `activeFrame()` mengembalikan `null` kalau ada teks yang warnanya atau fontnya sudah diubah manual. Ini yang dipakai untuk menandai bingkai "tidak lagi aktif".

### Urutan lapisan gambar

`renderComposition()` menggambar dari bawah ke atas. Ada enam lapisan, tidak lebih:

```
6. Teks
5. Stiker
4. Logo PhotoPip (di footer bawah)
3. Artwork paket bingkai (PNG transparan, diskalakan penuh ke kanvas)
2. Foto (dipotong cover-crop agar memenuhi slot, lalu filter diterapkan)
1. Latar (satu warna solid, diturunkan dari artwork)
```

Beberapa hal yang sering ditanyakan:

- Tidak ada garis tepi slot, gradasi, atau pola. Latar selalu satu warna solid, karena `background-fill.ts` hanya mengembalikan `background.value`.
- Artwork bingkai ada di depan. Piksel transparan memperlihatkan foto di bawahnya, piksel opaque menutupinya. Begitulah cara bingkai membentuk tepi foto.
- Logo selalu digambar, termasuk saat paket bingkai punya artwork sendiri.
- Renderer menolak komposisi yang belum lengkap. Kalau `photos.length !== template.photoCount`, yang keluar error "Incomplete composition".
- Gambar di-cache di memori, maksimal 24 entri dengan urutan LRU. Cache dibersihkan saat editor ditutup.
- Setiap gambar punya batas waktu muat 10 detik. Gambar dekoratif seperti artwork bingkai yang gagal dimuat akan dilewati dengan warning. Yang menghentikan render hanya pembatalan (`AbortError`).
- Font ditunggu sampai siap (`document.fonts.ready`) sebelum kanvas digambar, supaya teks tidak muncul dengan font fallback.

### Pohon komponen

Ini peta siapa memanggil siapa. Berguna waktu kamu mencari komponen, tapi bukan alur eksekusi. Alurnya ada di [Jejak satu foto](#jejak-satu-foto-dari-klik-sampai-unduh) di atas.

```
page.tsx
  └── Studio (studio.tsx)
        ├── useCamera()           ← akses webcam
        ├── useCaptureSession()   ← kelola session.photos[]
        │     └── sessionReducer  ← state machine foto
        ├── useFrameCatalog()     ← fetch /api/frames, gabung bingkai
        ├── useExport()           ← handle download
        └── Editor (lazy load, SSR disabled)
              ├── useEditorCanvas()   ← Fabric canvas, resize, pan, zoom
              ├── useStickerCatalog() ← fetch /api/stickers dinamis
              ├── history.ts          ← undo/redo stack
              ├── tabs.ts             ← navigasi keyboard tablist
              └── Panels: Frame, Photo, Sticker, Text, Property
```

### Bagaimana paket bingkai dan stiker dimuat

```
GET /api/frames
  └── scanFrameDirectory()
        ├── validasi nama folder
        ├── turunkan warna tema dari artwork
        ├── validasi 5 PNG (ukuran piksel harus tepat)
        └── kembalikan data + diagnostics (diagnostics hanya dev)
Browser
  └── useFrameCatalog()
        ├── mulai dengan preset bawaan (katalog tidak pernah kosong)
        ├── fetch /api/frames
        └── mergeFramePacks() → daftar bingkai di panel editor

GET /api/stickers
  └── scanStickersDirectory()
        ├── pindai folder public/assets/stickers/
        ├── buat kategori dinamis dari subfolder
        ├── beri cache-busting (?v=mtime-size)
        ├── kembalikan daftar stiker & kategori ke browser
        └── kalau scan gagal → { stickers: [], categories: [] } (bukan HTML 500)
Browser
  └── useStickerCatalog()
        ├── fetch /api/stickers
        └── tampilkan kategori & item di panel stiker
```

Kalau scan stiker gagal, endpoint mengembalikan daftar kosong, bukan halaman error. Panel stiker jadi kosong, tapi aplikasi tetap jalan. Bingkai juga tidak pernah kosong, karena katalog dimulai dari preset bawaan sebelum hasil fetch datang.

---

## Tech stack

| Teknologi       | Versi  | Fungsinya di PhotoPip                                    |
| --------------- | ------ | -------------------------------------------------------- |
| **Next.js**     | 16.4.5 | Framework utama: routing, server, App Router             |
| **React**       | 19.3   | Library UI: komponen, state, rendering                   |
| **TypeScript**  | 5.9    | Bahasa yang dipakai, mencegah error tipe sebelum runtime |
| **Fabric.js**   | 7.4.0  | Canvas editor: drag, resize, rotate stiker dan teks      |
| **next-themes** | 0.4.6  | Mode gelap/terang tanpa flash saat halaman dimuat        |
| **CSS**         | -      | Satu file global `globals.css`, tidak ada Tailwind       |
| **Vitest**      | 4.1    | Test runner                                              |
| **ESLint**      | 9      | Mencegah pola kode bermasalah                            |
| **Prettier**    | 3.6    | Formatter kode dan Markdown                              |
| **Knip**        | 6      | Deteksi file dan export yang tidak terpakai              |
| **sharp**       | 0.35.5 | Baca warna dominan artwork bingkai saat scan folder      |
| **Node.js**     | ≥ 22   | Runtime minimum untuk dev server dan build               |

---

## Peta folder dan file

Susunan folder mengikuti dua fase tadi. `studio/` untuk fase kamera, `editor/` untuk fase edit. Sisanya pendukung.

```
PhotoPip/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Kerangka HTML: metadata, font, ThemeProvider, LanguageProvider, Header
│   │   ├── page.tsx            ← Halaman "/", hanya render <Studio />
│   │   ├── globals.css         ← Satu-satunya file CSS: semua variabel warna, komponen, layout, responsif
│   │   └── api/
│   │       ├── frames/         ← GET /api/frames
│   │       │   ├── route.ts    ← handler: panggil scanner, log diagnostics, kirim JSON
│   │       │   └── scan.ts     ← validasi folder, ukuran PNG, warna tema dari artwork
│   │       └── stickers/       ← GET /api/stickers
│   │           ├── route.ts    ← handler: scan, fallback ke daftar kosong saat gagal
│   │           └── scan.ts     ← pindai subfolder, format nama, id unik, cache-busting
│   │
│   ├── components/
│   │   ├── header.tsx          ← App bar: logo, pilih bahasa, toggle gelap/terang
│   │   ├── icons.tsx           ← Semua ikon SVG inline
│   │   └── theme-provider.tsx  ← Wrapper tipis di atas next-themes
│   │
│   ├── features/
│   │   ├── studio/             ← FASE 1: semua yang terjadi sebelum editor
│   │   │   ├── studio.tsx      ← Komponen utama: fase, session, layout picker
│   │   │   ├── types.ts        ← StudioMessage ("capture" | "upload" | "export" | "downloaded")
│   │   │   ├── camera/
│   │   │   │   ├── use-camera.ts       ← Hook kamera: start/stop/capture/status
│   │   │   │   └── camera-utils.ts     ← Fungsi pendukung kamera
│   │   │   ├── hooks/
│   │   │   │   ├── use-capture-session.ts  ← Countdown, flash, dispatch ke reducer
│   │   │   │   ├── use-export.ts           ← Download PNG/JPEG
│   │   │   │   └── use-frame-catalog.ts    ← Fetch dan gabung bingkai
│   │   │   └── components/
│   │   │       ├── booth-stage.tsx      ← Area video kamera
│   │   │       ├── capture-controls.tsx ← Tombol shutter, timer, mirror, upload
│   │   │       ├── export-bar.tsx       ← Pilih format + tombol Download
│   │   │       ├── feedback.tsx         ← Toast pesan error/sukses
│   │   │       ├── film-strip.tsx       ← Grid thumbnail foto + tombol retake
│   │   │       └── template-selector.tsx ← Pilih tata letak (popover / bottom sheet)
│   │   │
│   │   └── editor/             ← FASE 2: editor Fabric.js
│   │       ├── editor.tsx      ← Komponen utama editor
│   │       ├── history.ts      ← Undo/redo stack (max 40 entry)
│   │       ├── tabs.ts         ← Hitung indeks tab untuk Arrow/Home/End
│   │       ├── types.ts        ← ToolTab ("frame" | "photo" | "sticker" | "text" | "properties")
│   │       ├── hooks/
│   │       │   ├── use-editor-canvas.ts  ← Inisialisasi Fabric, resize, event
│   │       │   └── use-sticker-catalog.ts ← Fetch katalog stiker dinamis (/api/stickers)
│   │       └── components/
│   │           ├── frame-panel.tsx      ← Grid kartu bingkai
│   │           ├── photo-panel.tsx      ← Filter per foto, retake
│   │           ├── sticker-panel.tsx    ← Cari dan tambah stiker (kategori dinamis)
│   │           ├── text-panel.tsx       ← Tambah dan kelola teks
│   │           ├── property-panel.tsx   ← Properti objek terpilih
│   │           ├── sticker-inspector.tsx ← Kontrol stiker: posisi, ukuran, rotasi
│   │           ├── text-inspector.tsx   ← Kontrol teks: font, warna, align
│   │           ├── layer-list.tsx       ← Daftar semua layer stiker dan teks
│   │           ├── tool-rail.tsx        ← Rail ikon tab editor
│   │           ├── number-field.tsx     ← Input angka di inspector
│   │           └── frame-preview.tsx    ← Kartu bingkai: slot + artwork, tanpa preview.png
│   │
│   ├── shared-tools/
│   │   ├── catalog/
│   │   │   ├── templates.ts    ← 5 definisi tata letak (ukuran, jumlah foto, slot)
│   │   │   ├── frames.ts       ← FramePreset, frameById(), applyFrame()
│   │   │   ├── frame-pack.ts   ← Kontrak folder bingkai: parsing, validasi PNG
│   │   │   ├── frame-packs.ts  ← packToFramePreset(), mergeFramePacks()
│   │   │   ├── stickers.ts     ← Tipe data Sticker (katalog datang dari scan folder)
│   │   │   ├── photo-filters.ts ← Definisi 6 filter
│   │   │   ├── fonts.ts        ← 5 font stack + resolveTextFont()
│   │   │   └── frame-dates.json ← Waktu tiap paket bingkai, untuk urutan di panel
│   │   ├── composition/
│   │   │   ├── types.ts        ← Composition, StickerPlacement, TextPlacement
│   │   │   ├── geometry.ts     ← Hitung posisi slot, crop, clamp
│   │   │   ├── render.ts       ← renderComposition(), satu renderer untuk editor dan ekspor
│   │   │   ├── export.ts       ← exportComposition() → toDataURL → download
│   │   │   ├── text.ts         ← normalizeText(): batas 120 char, min 18 px, clamp posisi
│   │   │   └── background-fill.ts ← Latar kanvas (satu warna solid)
│   │   ├── session.ts          ← Session type + sessionReducer
│   │   ├── image-upload.ts     ← Validasi dan resize foto upload
│   │   ├── id.ts               ← newId(): randomUUID dengan fallback untuk HTTP non-secure
│   │   └── async.ts            ← delay(ms, signal), setTimeout yang bisa di-abort
│   │
│   ├── translations/
│   │   ├── types.ts            ← Daftar bahasa, interface Messages
│   │   ├── index.ts            ← Registry semua locale
│   │   ├── use-language.tsx    ← LanguageProvider + useLanguage()
│   │   └── locales/
│   │       ├── id.ts           ← Indonesia (default)
│   │       ├── en.ts           ← English
│   │       ├── es.ts           ← Español
│   │       ├── fr.ts           ← Français
│   │       ├── de.ts           ← Deutsch
│   │       ├── ja.ts           ← 日本語
│   │       └── zh.ts           ← 中文
│   │
│   └── assets/fonts/
│       └── google-sans-flex-latin.woff2  ← Font self-hosted (tidak request ke Google)
│
├── public/
│   ├── assets/
│   │   ├── app-icons/      ← Favicon, Apple touch icon
│   │   ├── brand/logo.png  ← Logo di footer strip hasil cetakan
│   │   ├── stickers/       ← Folder stiker PNG (kategori sebagai subfolder)
│   │   └── frame-packs/    ← Taruh folder bingkai kamu di sini
│   │       └── _starter/   ← Contoh panduan (folder _ diabaikan scanner)
│   └── manifest.json       ← Web App Manifest
│
├── tests/
│   ├── camera.test.tsx
│   ├── capture-session.test.tsx
│   ├── composition.test.ts
│   ├── editor-tabs.test.ts
│   ├── frame-catalog.test.ts
│   ├── frame-pack.test.ts
│   ├── frame-preview.test.tsx
│   ├── image-upload.test.ts
│   ├── sticker-catalog.test.ts
│   └── translations.test.ts
│
├── scripts/
│   ├── audit-production.mjs    ← npm audit hanya untuk dependency produksi
│   ├── package-standalone.mjs  ← Menyalin public/ ke .next/standalone/ setelah build
│   └── sync-frame-dates.mjs    ← Isi frame-dates.json untuk folder bingkai baru
│
├── next.config.mjs             ← Header keamanan (CSP, Permissions-Policy), output standalone
├── vitest.config.mts           ← Konfigurasi Vitest (jsdom)
├── eslint.config.mjs           ← Konfigurasi ESLint
├── tsconfig.json               ← Konfigurasi TypeScript strict
└── package.json                ← Dependency dan semua npm script
```

---

## Cara membuat paket bingkai sendiri

Paket bingkai adalah folder berisi beberapa file PNG yang ditaruh di `public/assets/frame-packs/`. Selama dev server jalan, folder itu dibaca otomatis dan bingkainya langsung muncul di panel editor.

Tidak perlu menulis kode. Tidak perlu mendaftarkan apa pun.

### 1. Buat folder bingkai

Buat folder baru di `public/assets/frame-packs/`. Namanya bebas: huruf besar, spasi, dan simbol boleh. Yang tampil di web dirapikan otomatis, misalnya folder `My Cool Frame` menjadi **My Cool Frame**.

Dua batasan:

- Jangan diawali `_` atau `.` (folder seperti itu dilewati, contohnya `_starter`).
- Setelah dibersihkan harus tersisa huruf atau angka. Folder yang isinya cuma simbol (misalnya `!!!`) ditolak.

Dua folder yang setelah dibersihkan jadi nama yang sama (misalnya `GTA 6` dan `gta-6`) bentrok, dan yang kedua ditolak.

### 2. Siapkan 5 file PNG artwork

Artwork itu lapisan transparan yang ditaruh di atas foto. Cara kerjanya persis seperti bingkai foto fisik: bagian transparan memperlihatkan foto di bawahnya, bagian berwarna menutupinya.

Ukurannya harus tepat. Selisih satu piksel saja, foldernya ditolak.

| File         | Ukuran (piksel) | Untuk tata letak |
| ------------ | --------------- | ---------------- |
| `4x1.png`    | 600 × 1800      | Strip 4 foto     |
| `3x1.png`    | 600 × 1350      | Strip 3 foto     |
| `2x3.png`    | 1200 × 1800     | Grid 2×3         |
| `2x2.png`    | 1200 × 1200     | Grid 2×2         |
| `single.png` | 1200 × 1800     | Satu foto        |

> **Penting:** nama file untuk satu foto adalah `single.png`, bukan `1x1.png`. Ad-blocker bisa memblokir file bernama `1x1.png` karena dikira tracking pixel.

Kalau perlu tahu posisi slot foto supaya desainmu pas, buka bagian ini:

<details>
<summary>Koordinat slot foto tiap template</summary>

Format: `x, y, lebar, tinggi` (dalam piksel)

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

### 3. Kartu di panel tidak butuh file cover

Tidak ada `preview.png` dan tidak ada `frame.json`. Kartu di panel editor digambar
oleh `FramePreview`: kotak slot ditambah artwork template yang sedang aktif.

**Tema otomatis.** Scanner menurunkan tema dari `single.png`:

- **Warna latar** — warna opaque yang paling dominan di artwork.
- **Warna teks** — `#20231f` kalau latar terang, `#ffffff` kalau latar gelap.
- **Font** — selalu `app` (font tidak bisa ditebak dari gambar).
- **Nama bingkai** — dari nama folder, misal `neon-nights` menjadi "Neon Nights".

Jadi untuk menambah bingkai cukup taruh lima PNG artwork.
Kalau artwork punya area dekorasi yang lebih luas daripada bingkainya, warna latar bisa
meleset; hasil selalu aman terbaca, tapi bisa kurang sesuai tema.

### Batas validasi yang diterapkan scanner

| Aturan              | Nilai                                                                              |
| ------------------- | ---------------------------------------------------------------------------------- |
| Panjang nama folder | maksimal 60 karakter setelah dibersihkan jadi huruf kecil, angka, dan tanda hubung |
| Ukuran tiap artwork | maksimal 8 MB (lebih dari itu hanya warning)                                       |
| Dimensi artwork     | harus **tepat** sama dengan tabel di atas, selisih 1 piksel = folder ditolak       |

Artwork selalu diskalakan penuh ke ukuran kanvas template. Jadi desainlah di ukuran cetak aslinya, bukan ukuran yang lebih kecil, supaya tidak blur.

Folder yang ditolak tidak muncul di katalog dan tidak merusak paket lain. Semua masalahnya dicatat di `diagnostics`.

Paket yang lolos diurutkan dari yang paling baru. Waktunya disimpan di `src/shared-tools/catalog/frame-dates.json`. `npm run dev` dan `npm run build` menjalankan `scripts/sync-frame-dates.mjs` dulu: folder yang sudah punya waktu tidak diubah, folder baru dapat waktu dari commit git yang menambahkannya (atau waktu file kalau git tidak ada). Di Vercel dan CI (`VERCEL` atau `CI`) skrip langsung keluar, jadi file yang sudah di-commit yang dipakai. Kalau skrip menulis file, diff itu perlu di-commit bersama paket barunya.

### 4. Muat ulang halaman

Setelah foldernya selesai, muat ulang `http://localhost:3000`. Bingkai baru langsung muncul di panel editor.

### Cara debug kalau bingkai tidak muncul

Buka `http://localhost:3000/api/frames` di browser. Response-nya punya dua bagian:

- `frames`: daftar bingkai yang berhasil dimuat
- `diagnostics`: daftar error dan warning per folder. Bagian ini hanya muncul saat development; di produksi array-nya selalu kosong.

Kode diagnostic yang mungkin muncul: `bad-folder-name`, `missing-artwork`, `bad-png`, `bad-dimensions`, `large-artwork` (warning), `theme-fallback` (warning), `duplicate-pack-id`.

---

## Cara menambah stiker sendiri

Menambah stiker tidak perlu menyentuh kode sama sekali, dan tidak ada file JSON yang harus diedit.

### 1. Siapkan file gambar

- Format yang dipindai: **PNG**, **WebP**, **JPG/JPEG**. SVG, AVIF, BMP, GIF, dan HEIC tidak dipindai.
- PNG transparan paling aman, karena latar kanvas belum tentu putih.
- Harus persegi (rasio 1:1), sekitar 256×256 px sampai 512×512 px. Renderer memakai lebar gambar untuk kedua sumbu, jadi stiker non-persegi akan gepeng.
- Sebaiknya di bawah 500 KB supaya kanvas editor tetap ringan.

### 2. Taruh ke folder kategori

- Masukkan file ke subfolder kategori: `public/assets/stickers/<nama-kategori>/`
- Contoh: `public/assets/stickers/cute/kucing-lucu.png`
- Kalau mau stiker tanpa kategori khusus, taruh langsung di `public/assets/stickers/`. Stiker seperti ini masuk kategori `all`.
- Folder atau file yang diawali `_` atau `.` dilewati, jadi bisa dipakai untuk menyimpan draf.

### 3. Kategori dan nama otomatis

- Nama tab kategori diambil dari nama folder, lalu dikapitalisasi. Folder `y2k` jadi tab **Y2K**, folder `retro-vibes` jadi tab **Retro Vibes**.
- Nama stiker diambil dari nama file. `_` dan `-` berubah jadi spasi, tiap kata dikapitalisasi. `kucing-lucu.png` jadi **Kucing Lucu**.
- Tag pencarian diambil dari nama kategori plus tiap kata di nama file. Untuk contoh tadi: `cute`, `kucing`, `lucu`.
- ID dibentuk dari `kategori-namafile` yang sudah disanitasi. Kalau bentrok, diberi akhiran `-2`, `-3`, dan seterusnya.
- Daftar stiker diurutkan alfabetis berdasarkan nama.

### 4. Muat ulang halaman

Muat ulang browser di `http://localhost:3000`. Endpoint `/api/stickers` otomatis membaca file baru, tidak perlu restart server.

Setiap URL stiker diberi query `?v=<mtime>-<size>`. Jadi kalau kamu mengganti isi file dengan nama yang sama, cache browser langsung ter-bust.

---

## Cara menambah atau mengubah bagian kode

### Menambah tata letak baru

1. Tambah entry ke `src/shared-tools/catalog/templates.ts`
2. Tambah `layoutNames` ke semua 7 locale di `src/translations/locales/`
3. Tambahkan file PNG untuk template baru di setiap paket bingkai yang sudah ada
4. Update tabel di README ini

`templateArtworkSpecs` di `frame-pack.ts` dihitung otomatis dari geometri template, jadi nama file dan ukuran PNG yang diminta scanner ikut menyesuaikan. Kamu tetap harus menyediakan file PNG-nya di tiap paket.

### Menambah filter baru

1. Tambah ID ke union `PhotoFilterId` di `src/shared-tools/composition/types.ts`
2. Tambah case ke `applyPhotoFilter()` di `render.ts`. Ini efek Fabric yang sesungguhnya.
3. Tambah entry ke `photoFilters` di `src/shared-tools/catalog/photo-filters.ts`. Preview CSS di panel hanya perkiraan, jadi sinkronkan manual dengan `render.ts`.
4. Tambah key `filterNames.<id>` ke semua 7 locale

### Menambah jenis objek baru di kanvas

Agar bisa dipilih dan diedit, setiap objek interaktif butuh tiga hal: `placementId` (id-nya di `Composition`), `objectType` (`"sticker"` atau `"text"`), dan `selectable/evented` sesuai mode.

Perubahan transform ditangkap `object:modified` di `use-editor-canvas.ts`, lalu dikembalikan ke `Composition` lewat `onCommit`.

### Menambah bahasa baru

1. Tambah kode bahasa ke array `languages` di `src/translations/types.ts`
2. Buat file `src/translations/locales/<kode>.ts` yang memenuhi interface `Messages`
3. Tambah ke object `messages` di `src/translations/index.ts`
4. Tambah ke `languageNames` di `src/translations/types.ts`

### Aturan wajib saat mengubah kode

| Aturan                                                                            | Kenapa                                                                                           |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Perubahan visual wajib masuk `render.ts`                                          | Editor dan ekspor pakai renderer yang sama. Kalau cuma editor yang diubah, hasil unduhan berbeda |
| Jangan mutasi `Composition` atau `Session` langsung                               | State immutable mencegah bug re-render yang sulit dilacak                                        |
| Semua string UI harus masuk ke 7 locale                                           | Hardcode teks bahasa apa pun di komponen = bug i18n                                              |
| Jangan import `window`, `document`, `navigator` di kode yang bisa dirender server | Next.js merender sebagian kode di server Node.js                                                 |
| Jangan pakai `// eslint-disable` atau `@ts-ignore`                                | Perbaiki akar masalahnya, jangan sembunyikan error-nya                                           |
| Jalankan `npm run verify` sebelum selesai                                         | Satu perintah yang cek semua                                                                     |

---

## Testing: cara menguji kode

```bash
npm test                                    # jalankan semua tes
npx vitest run tests/camera.test.tsx        # jalankan satu file saja
npx vitest --watch                          # watch mode, tes ulang saat file berubah
```

Semua tes ada di folder `tests/` dan memakai Vitest, Testing Library, serta jsdom.

| File tes                   | Yang diuji                                                   |
| -------------------------- | ------------------------------------------------------------ |
| `camera.test.tsx`          | Status kamera, penanganan error, abort, cleanup stream       |
| `capture-session.test.tsx` | `sessionReducer`: capture, retake, reset, batas slot         |
| `composition.test.ts`      | Geometri slot, cover-crop, clamp posisi stiker dan teks      |
| `editor-tabs.test.ts`      | Navigasi keyboard Arrow/Home/End di tablist editor           |
| `image-upload.test.ts`     | Validasi file upload, batas ukuran, resize                   |
| `sticker-catalog.test.ts`  | Pemindaian folder stiker: format nama, id, kategori, tag     |
| `frame-catalog.test.ts`    | `mergeFramePacks`, hook `useFrameCatalog`                    |
| `frame-pack.test.ts`       | Validasi folder bingkai: ukuran PNG, nama folder, warna tema |
| `frame-preview.test.tsx`   | Render komponen `FramePreview`                               |
| `translations.test.ts`     | Kelengkapan key di ketujuh locale                            |

Yang tidak dicakup tes: hasil visual, kualitas cetak, dan perilaku kamera di hardware nyata. Tiga hal itu harus dicek manual.

---

## Pemecahan masalah umum

### Kamera tidak menyala

- Pastikan halaman dibuka lewat **HTTPS** atau `http://localhost`. Alamat seperti `http://192.168.x.x` tidak akan berhasil.
- Periksa izin kamera di browser. Biasanya ada ikon kecil di address bar.
- Tutup aplikasi lain yang sedang memakai kamera (Zoom, Meet, dan sejenisnya).
- Lihat kode error yang muncul di UI, lalu cocokkan dengan tabel kode error di bagian Kamera.

### Dev server dibuka dari HP atau IP jaringan lokal

Next.js 16 memblokir resource dev (HMR, chunk internal) dari origin yang tidak dikenal. Gejalanya: halaman tampil, tapi console penuh pesan `Blocked cross-origin request to Next.js dev resource` dan `WebSocket ... ERR_INVALID_HTTP_RESPONSE`.

1. Tambahkan IP komputermu ke `allowedDevOrigins` di `next.config.mjs` (misalnya mengganti atau menambah daftar array `allowedDevOrigins`):

   ```js
   allowedDevOrigins: ["192.168.1.50"],
   ```

2. Restart `npm run dev`.
3. Ingat, kamera tetap tidak akan jalan lewat `http://192.168.x.x` karena bukan secure context. Untuk menguji kamera di HP, pakai tunnel HTTPS seperti `ngrok` atau Cloudflare Tunnel, atau deploy ke Vercel.

### Stiker baru tidak muncul di panel

1. Cek ekstensinya. Hanya `.png`, `.webp`, `.jpg`, dan `.jpeg` yang dipindai.
2. Pastikan file ada di dalam subfolder kategori, bukan di folder yang lebih dalam lagi. Scanner hanya membaca satu level.
3. Pastikan nama file atau foldernya tidak diawali `_` atau `.`.
4. Buka `http://localhost:3000/api/stickers` dan cari nama stiker di response.
5. Muat ulang halaman. Endpoint memakai `no-store`, jadi tidak perlu restart server.

### Editor berhenti di "Processing…" atau menampilkan error render

- Buka console browser. Error aslinya selalu dicatat sebagai `[editor] preview render failed`.
- Pastikan jumlah foto sama dengan `photoCount` template.
- Kalau artwork bingkai gagal dimuat, render tetap lanjut dengan warning `[render] skipped decorative image`. Yang menghentikan render hanya kegagalan pada foto utama.
- Klik tombol **Coba lagi** di area kanvas untuk mengulang render.

### Paket bingkai tidak muncul di editor

1. Buka `http://localhost:3000/api/frames`, lalu lihat bagian `diagnostics`.
2. Pastikan kelima file PNG ada dan ukurannya tepat.
3. Pastikan nama folder menyisakan huruf atau angka, serta tidak diawali `_` atau `.`.
4. Muat ulang halaman setelah menambah atau mengubah paket.

### `npm install` gagal

- Pastikan Node.js versi 22 atau lebih baru: `node --version`
- Hapus folder `node_modules/` dan file `package-lock.json`, lalu jalankan `npm install` lagi
- Pastikan koneksi internet aktif

### Stiker atau teks tidak muncul di file unduhan

- Pastikan `renderComposition()` di `render.ts` sudah diperbarui. Editor dan ekspor memakai fungsi yang sama.
- Cek console browser untuk error gambar yang gagal dimuat.

### Halaman terasa lambat atau macet di editor

- Cek console browser untuk error Fabric.js.
- Pastikan kanvas editor punya ukuran lebih dari 0 dan tidak tersembunyi oleh CSS.

### Aset 404 setelah `npm run build`

- Jalankan `npm run build` sebelum `npm start`. Skrip build yang menyalin `public/` ke folder standalone, jadi tanpa build asetnya belum ada di sana.
- Jangan menjalankan `npm start` tanpa build sebelumnya.

### Foto hilang setelah refresh

Ini memang disengaja. Tidak ada penyimpanan permanen, jadi unduh fotomu dulu sebelum me-refresh atau meninggalkan halaman.

---

## Kontribusi

Kontribusi terbuka untuk siapa saja.

1. **Fork** repositori ini di GitHub.
2. **Buat branch** untuk perubahanmu: `git checkout -b fitur/nama-fitur`
3. **Buat perubahan.** Ikuti aturan pengembangan di atas.
4. **Jalankan gate.** `npm run verify` harus lolos penuh tanpa error.
5. **Commit** dengan pesan yang jelas tentang apa yang berubah.
6. **Buat Pull Request**, lalu jelaskan apa yang berubah dan kenapa.

Beberapa hal yang paling sering ditanyakan saat review:

- Semua string UI baru harus ada di 7 locale.
- Perubahan visual harus masuk `render.ts`, bukan hanya komponen editor.
- Dependency baru perlu didiskusikan dulu sebelum ditambahkan.
- Satu PR sebaiknya satu tujuan. Lebih mudah di-review, lebih cepat di-merge.

---

## Lisensi aset

- **Font Google Sans Flex** memakai [SIL Open Font License (OFL)](https://scripts.sil.org/OFL). File lisensinya ada di `src/assets/fonts/OFL.txt`, dan harus tetap disertakan kalau kamu mendistribusikan ulang.
- **Stiker dan paket bingkai** di `public/assets/` adalah aset gambar pihak ketiga atau buatan sendiri. Sebelum memakai atau mendistribusikan ulang, pastikan lisensi tiap asetnya jelas. Kalau kamu menambahkan aset baru, sertakan file lisensinya di folder aset tersebut.
