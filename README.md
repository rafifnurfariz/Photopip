# PhotoPip

PhotoPip adalah bilik foto di browser. Pilih bentuk cetakan, ambil atau unggah foto, hias, lalu unduh sebagai PNG atau JPEG.

Panduan ini menjelaskan cara memakai situs dan cara mempelajari kode proyek, dari menyiapkan komputer sampai mengikuti alur file yang menjalankan website.

## Isi panduan

- [Cara menggunakan situs](#cara-menggunakan-situs)
- [Menyiapkan proyek dari GitHub](#menyiapkan-proyek-dari-github)
- [Menjalankan dan memeriksa proyek](#menjalankan-dan-memeriksa-proyek)
- [Privasi dan penyimpanan](#privasi-dan-penyimpanan)
- [Teknologi yang digunakan](#teknologi-yang-digunakan)
- [Fitur dan alur kerja](#fitur-dan-alur-kerja)
- [Istilah sederhana](#istilah-sederhana)
- [Cara gambar dirakit](#cara-gambar-dirakit)
- [Paket tema](#paket-tema)
- [Ukuran cetak dan kualitas](#ukuran-cetak-dan-kualitas)
- [Struktur berkas proyek](#struktur-berkas-proyek)
- [Alur kode: file mana memanggil apa](#alur-kode-file-mana-memanggil-apa)
- [Cara mengubah bagian website](#cara-mengubah-bagian-website)
- [Aturan penting saat mengembangkan](#aturan-penting-saat-mengembangkan)
- [Pengujian dan pemeriksaan](#pengujian-dan-pemeriksaan)
- [Pemecahan masalah](#pemecahan-masalah)
- [Hal yang memang belum tersedia](#hal-yang-memang-belum-tersedia)

## Cara menggunakan situs

1. Pilih bentuk cetakan.
2. Izinkan kamera, atau pilih foto dari perangkat.
3. Ambil foto satu per satu, atau biarkan otomatis.
4. Kalau perlu, ambil ulang salah satu foto.
5. Setelah semua slot terisi, masuk ke editor.
6. Pilih tema, filter, stiker, atau teks.
7. Pilih format PNG/JPEG dan skala 1×, 2×, atau 3×, lalu unduh.

Kamera baru dinyalakan setelah tombol kamera ditekan. Kamera hanya bekerja di HTTPS atau `http://localhost`. Browser biasanya menolak kamera di alamat seperti `http://192.168.1.5`.

## Menyiapkan proyek dari GitHub

Bagian ini untuk menjalankan salinan proyek di komputermu. Pengunjung situs yang sudah online tidak perlu melakukan langkah ini.

1. **Pasang Node.js 22 atau lebih baru.** Unduh dari [nodejs.org](https://nodejs.org) dan pilih rilis LTS yang memenuhi versi tersebut. npm ikut disertakan bersama Node.js; proyek ini menggunakan npm 11.
2. **Unduh kode dari GitHub.** Pilih **Code → Download ZIP** lalu ekstrak ke folder biasa, atau gunakan `git clone <alamat-repositori>`. Jangan menjalankan proyek dari dalam arsip ZIP.
3. **Buka folder utama proyek** di VS Code atau terminal. Folder yang benar berisi `package.json`; jangan masuk ke `src/` untuk menjalankan perintah npm.
4. **Periksa Node.js dan npm** di terminal baru:

   ```bash
   node --version
   npm --version
   ```

   Node.js harus versi 22 atau lebih baru, npm versi 11. Jika perintah tidak dikenal, pasang Node.js atau buka ulang terminal setelah instalasi.

5. **Pasang pustaka proyek:**

   ```bash
   npm install
   ```

   npm membaca daftar di `package.json` dan versi terkunci di `package-lock.json`, lalu mengunduh pustaka ke `node_modules/`.

6. **Nyalakan website lokal:**

   ```bash
   npm run dev
   ```

7. Buka `http://localhost:3000` di browser. Biarkan terminal tetap berjalan selama situs digunakan. Tekan `Ctrl+C` di terminal untuk menghentikan server.

`node_modules/` tidak disimpan di GitHub: folder itu besar dan bisa dibuat ulang dengan `npm install`. `.gitignore` memberi tahu Git untuk melewatkan folder itu serta hasil build seperti `.next/`; jadi folder tersebut memang tidak diunduh bersama kode. Jangan mengunggahnya ke GitHub.

Jika proyek diambil menggunakan Git dan kodenya diperbarui, jalankan `git pull`, lalu `npm install`, kemudian mulai ulang `npm run dev` jika diperlukan.

## Menjalankan dan memeriksa proyek

Perintah yang tersedia dari folder utama proyek:

| Perintah                   | Kegunaan                                                          |
| -------------------------- | ----------------------------------------------------------------- |
| `npm run dev`              | Menyalakan server pengembangan lokal dengan Turbopack             |
| `npm run build`            | Membuat build produksi dan mengemas server standalone             |
| `npm start`                | Menjalankan `.next/standalone/server.js` setelah build            |
| `npm run format`           | Merapikan format kode dan Markdown                                |
| `npm run format:check`     | Memeriksa format tanpa mengubah berkas                            |
| `npm run type-check`       | Memeriksa tipe TypeScript                                         |
| `npm run lint`             | Memeriksa aturan kode; peringatan membuat pemeriksaan gagal       |
| `npm test`                 | Menjalankan semua tes sekali dengan Vitest                        |
| `npm run deadcode`         | Mencari kode atau pustaka yang tidak digunakan                    |
| `npm run audit:production` | Memeriksa kerentanan pustaka produksi                             |
| `npm run verify`           | Menjalankan format, tipe, lint, tes, dead-code, audit, lalu build |

`npm start` bukan pengganti `npm run dev`: perintah itu memerlukan build produksi yang sudah dibuat. Untuk pemula yang sedang belajar kode, gunakan `npm run dev`.

Saat menjalankan `npm run dev`, buka `http://localhost:3000`. Kamera hanya bisa digunakan pada HTTPS atau localhost. Untuk build produksi jalankan `npm run build`, lalu `npm start`; `npm start` memerlukan `.next/standalone/server.js` hasil build. `NEXT_PUBLIC_SITE_URL` menjadi URL dasar metadata, sedangkan `PORT` dapat memilih port server.

## Privasi dan penyimpanan

Semua foto diproses di perangkatmu. Tidak ada foto yang dikirim ke server, tidak ada database foto, dan tidak ada akun.

Server hanya punya satu endpoint: `GET /api/themes` untuk membaca paket tema.

Foto sementara disimpan sebagai data URL di memori halaman. Saat unduh, browser menggambar hasil di kanvas lalu membuat file di perangkatmu.

Setelah halaman dimuat ulang atau ditutup, foto dan komposisi hilang. Yang disimpan hanya pilihan bahasa dan mode terang/gelap. Jangan berharap bisa memulihkan hasil foto setelah refresh.

## Teknologi yang digunakan

Tech stack adalah kumpulan alat yang dipakai untuk membangun website.

| Teknologi                   | Gunanya                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**              | Bahasa yang dipakai untuk menulis kode aplikasi. Ia menambahkan pemeriksaan tipe data pada JavaScript agar beberapa kekeliruan bisa ditemukan sebelum website dijalankan. |
| **React**                   | Alat untuk membuat tampilan dari komponen kecil (header, tombol, panel kamera, editor).                                                                                   |
| **Next.js**                 | Kerangka utama berbasis React. Ia mengatur halaman, server pengembangan, build produksi, dan route server seperti `/api/themes`.                                          |
| **Fabric.js**               | Alat untuk mengelola kanvas editor: geser, ubah ukuran, putar foto, stiker, dan teks.                                                                                     |
| **CSS**                     | Aturan tampilan (warna, jarak, ukuran, layout). Semua gaya ada di `src/app/globals.css`.                                                                                  |
| **Node.js**                 | Program yang menjalankan alat pengembangan dan server Next.js.                                                                                                            |
| **npm**                     | Alat untuk memasang pustaka dan menjalankan perintah seperti `npm run dev`.                                                                                               |
| **Vitest**                  | Alat tes otomatis.                                                                                                                                                        |
| **Testing Library + jsdom** | Membantu mengetes komponen React tanpa membuka browser sungguhan.                                                                                                         |
| **ESLint**                  | Memeriksa pola kode yang berpotensi bermasalah.                                                                                                                           |
| **Prettier**                | Merapikan format kode secara otomatis.                                                                                                                                    |
| **Knip**                    | Mencari berkas atau pustaka yang tidak terpakai.                                                                                                                          |

Sebagian alat menjadi bagian dari aplikasi saat berjalan, seperti React, Next.js, dan Fabric.js. Vitest, Testing Library, jsdom, ESLint, Prettier, dan Knip membantu pengembangan atau pemeriksaan, bukan fitur yang dipakai pengunjung secara langsung. Kode aplikasi ditulis dalam TypeScript; Next.js memprosesnya untuk dijalankan.

Versi pustaka tercatat di `package.json` dan `package-lock.json`.

## Fitur dan alur kerja

### Tata letak cetakan

Ada lima pilihan:

| ID    | Nama            | Ukuran cetak | Jumlah foto | Susunan               |
| ----- | --------------- | ------------ | ----------: | --------------------- |
| `4x1` | Strip klasik    | 2 × 6 inci   |           4 | Satu kolom vertikal   |
| `3x1` | Strip tiga foto | 2 × 4,5 inci |           3 | Satu kolom vertikal   |
| `2x3` | Grid            | 4 × 6 inci   |           6 | Dua kolom, tiga baris |
| `2x2` | Grid persegi    | 4 × 4 inci   |           4 | Dua kolom, dua baris  |
| `1x1` | Satu foto       | 4 × 6 inci   |           1 | Satu foto besar       |

Mengganti tata letak akan menghapus foto yang sudah diambil, karena jumlah dan bentuk slot bisa berbeda. Kalau sudah ada foto, aplikasi akan minta konfirmasi dulu.

### Kamera dan pengambilan

Kamera meminta video depan ukuran ideal 1280 × 960 tanpa audio. Aplikasi menunggu video siap maksimal 10 detik.

Timer shutter bisa diset 0, 3, atau 5 detik. Setelah foto diambil, layar berkedip sebentar.

Pengambilan otomatis mengisi semua slot yang kosong. Foto pertama pakai timer pilihan, foto berikutnya jeda 5 detik. Tombol batal menghentikan hitung mundur, tapi foto yang sudah berhasil tetap ada.

Kamera dihentikan setelah sesi selesai, saat retake, reset, masuk editor, atau halaman disembunyikan.

Kode masalah kamera:

| Kode          | Arti                                                                             |
| ------------- | -------------------------------------------------------------------------------- |
| `denied`      | Izin ditolak atau diblokir kebijakan browser                                     |
| `missing`     | Kamera tidak ditemukan atau tidak mendukung batasan yang diminta                 |
| `busy`        | Kamera sedang dipakai atau stream terputus                                       |
| `unavailable` | Kemampuan kamera tidak tersedia atau terjadi kesalahan lain                      |
| `readiness`   | Stream ada, tetapi tidak menghasilkan frame yang dapat dipakai dalam batas waktu |
| `capture`     | Gagal mengambil atau membaca frame                                               |

### Retake dan perpindahan mode

Ada dua fase: mengambil foto dan mengedit. Editor hanya bisa dibuka setelah semua slot terisi.

Saat retake, draf komposisi (tema, stiker, teks, filter) tetap disimpan. Hanya foto di slot yang dipilih yang diganti.

Reset memulai sesi baru dan membuang semua foto serta draf. Kalau sudah ada foto, muncul konfirmasi dulu.

### Unggah foto

Bisa unggah file gambar. Aplikasi memproses satu per satu sebanyak slot yang masih kosong. Saat retake, hanya satu file yang dipakai untuk mengganti slot.

Format yang diterima berdasarkan MIME type atau ekstensi: avif, bmp, gif, heic, heif, jpg, jpeg, png, webp. Gambar diperkecil (sisi terpanjang maksimal 2000 px), latar transparan diratakan ke putih, lalu diubah ke JPEG kualitas 0,92. HEIC/HEIF hanya bisa digunakan jika browser dapat membacanya.

Unggah tidak bisa dipakai saat pengambilan sedang berjalan atau semua slot sudah penuh.

### Editor

Editor memakai Fabric.js dan hanya dimuat saat dibutuhkan. Ada lima panel: Tema, Foto, Stiker, Teks, dan Properti.

Kanvas mempertahankan koordinat ukuran cetak. Ukuran tampilan diubah lewat CSS supaya posisi objek tidak berubah.

Zoom bisa dari 50% sampai 400% (langkah 25%). Zoom hanya mengubah tampilan, bukan ukuran file unduhan.

Objek bisa digeser, diubah ukuran, diputar, dibalik, dan diatur opasitasnya. Ada undo/redo sampai 40 langkah.

### Tema

Tema adalah paket tampilan (latar, bingkai opsional, warna teks, font, artwork). Saat ini daftar preset bawaan kosong. `plain` adalah tema fallback putih, bukan kartu yang bisa dipilih; tema yang dapat dipilih berasal dari paket tema yang ditemukan.

Menerapkan tema mengubah warna dan font teks yang sudah ada, tanpa menghapus foto, stiker, atau teks.

### Filter foto

Filter hanya berlaku pada foto yang dipilih:

| ID        | Tampilan    |
| --------- | ----------- |
| `none`    | Asli        |
| `bw`      | Hitam putih |
| `warm`    | Hangat      |
| `cool`    | Sejuk       |
| `vintage` | Vintage     |
| `fade`    | Pudar       |

### Stiker dan teks

Ada 15 stiker: sunglasses, mustache, crown, heart, star, bowtie, speechBubble, hat, glasses, wink, rainbow, peace, lightning, diamond, unicorn. Nama dan tag pencarian stiker memakai bahasa Inggris.

Stiker baru muncul di tengah kanvas, ukuran 25% lebar kanvas. Setiap tempelan adalah objek terpisah.

Teks baru memakai warna dan font tema aktif (atau fallback `plain`). Maksimal 120 karakter; ukuran minimum 18 piksel cetak. Teks kosong tidak digambar di hasil akhir.

### Ekspor

Bisa unduh sebagai PNG atau JPEG. Skala 1× adalah ukuran dasar, 2× dan 3× melipatgandakan jumlah piksel.

JPEG memakai kualitas 0,95. File diberi nama `photopip-<waktu>.png` atau `.jpg`.

Ekspor membangun kanvas baru yang tidak terlihat, menggambar komposisi, lalu membuat unduhan. Ekspor tidak bergantung pada kanvas editor.

## Istilah sederhana

| Istilah               | Artinya                                                              |
| --------------------- | -------------------------------------------------------------------- |
| Tata letak / template | Bentuk cetakan yang menentukan ukuran, jumlah foto, dan susunan slot |
| Slot                  | Persegi panjang tempat foto diletakkan                               |
| Sesi                  | Progress pengambilan foto (tata letak + foto yang terkumpul)         |
| Komposisi             | Semua bahan hasil: template, foto, tema, stiker, teks, filter        |
| Draf                  | Komposisi sementara saat berpindah antara ambil foto dan edit        |
| Penempatan            | Satu salinan stiker atau teks dengan posisi dan gaya sendiri         |
| Filter                | Efek warna pada satu foto                                            |
| Paket tema            | Folder berisi artwork PNG dan info tema                              |
| Artwork               | Gambar dekorasi PNG yang diletakkan di atas foto                     |
| Pratinjau             | Kanvas editor yang terlihat di layar                                 |
| Ekspor                | Pembuatan file gambar di perangkat                                   |
| Zoom                  | Pembesaran tampilan editor saja                                      |
| Skala ekspor          | Pengali jumlah piksel file unduhan                                   |
| Data URL              | Teks yang memuat isi gambar                                          |
| Render                | Proses menggambar semua lapisan menjadi satu gambar                  |

## Cara gambar dirakit

Urutan lapisan dari belakang ke depan:

1. Latar (warna, gradasi, atau pola)
2. Bingkai preset (jika ada)
3. Foto (satu per slot, dipotong tengah agar memenuhi slot)
4. Garis tepi slot dari bingkai
5. Artwork paket tema
6. Logo di area footer
7. Stiker
8. Teks

Foto tetap berbentuk persegi panjang slot. Artwork yang buram bisa menutupi foto. Perubahan visual harus masuk ke renderer bersama supaya pratinjau dan unduhan sama.

## Paket tema

Paket tema ada di folder `public/assets/theme-packs/<id>/`. Server membaca folder lewat `GET /api/themes`.

Setiap paket minimal butuh lima file PNG dengan ukuran tepat:

| Berkas       |      Ukuran | Isi                 |
| ------------ | ----------: | ------------------- |
| `4x1.png`    |  600 × 1800 | Empat slot vertikal |
| `3x1.png`    |  600 × 1350 | Tiga slot vertikal  |
| `2x3.png`    | 1200 × 1800 | Enam slot grid      |
| `2x2.png`    | 1200 × 1200 | Empat slot grid     |
| `single.png` | 1200 × 1800 | Satu slot besar     |

Nama file harus `single.png` (bukan `1x1.png`).

`theme.json` bersifat opsional (maksimal 16 KB):

```json
{
  "name": "Neon Nights",
  "textColor": "#f8fafc",
  "fontId": "display",
  "backgroundColor": "#0b1020"
}
```

| Kolom             | Nilai bawaan | Aturan                                         |
| ----------------- | ------------ | ---------------------------------------------- |
| `name`            | Nama folder  | 1–60 karakter                                  |
| `textColor`       | `#20231f`    | Warna `#rrggbb`                                |
| `fontId`          | `app`        | `app`, `serif`, `sans`, `mono`, atau `display` |
| `backgroundColor` | `#ffffff`    | Warna `#rrggbb`                                |

ID folder harus huruf kecil, angka, dan tanda hubung. Maksimal 40 karakter. Folder yang diawali `_` atau `.` diabaikan.

Slot untuk desain artwork:

| Berkas       | Slot `(x, y, lebar, tinggi)`                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `4x1.png`    | `(27,27,546,407.25)`, `(27,449.25,546,407.25)`, `(27,871.5,546,407.25)`, `(27,1293.75,546,407.25)`                        |
| `3x1.png`    | `(27,27,546,398)`, `(27,440,546,398)`, `(27,853,546,398)`                                                                 |
| `2x3.png`    | `(54,54,531,496)`, `(615,54,531,496)`, `(54,580,531,496)`, `(615,580,531,496)`, `(54,1106,531,496)`, `(615,1106,531,496)` |
| `2x2.png`    | `(54,54,531,459)`, `(615,54,531,459)`, `(54,543,531,459)`, `(615,543,531,459)`                                            |
| `single.png` | `(54,54,1092,1548)`                                                                                                       |

## Ukuran cetak dan kualitas

Ukuran internal disebut piksel cetak. Tampilan editor lebih kecil lewat CSS, tetapi koordinat objek tetap sama.

| Template | Kanvas dasar | Margin | Jarak antar-slot | Footer logo | Ukuran slot (perkiraan) |
| -------- | -----------: | -----: | ---------------: | ----------: | ----------------------- |
| `4x1`    |   600 × 1800 |     27 |               15 |          72 | 546 × 407,25            |
| `3x1`    |   600 × 1350 |     27 |               15 |          72 | 546 × 398               |
| `2x3`    |  1200 × 1800 |     54 |               30 |         144 | 531 × 496               |
| `2x2`    |  1200 × 1200 |     54 |               30 |         144 | 531 × 459               |
| `1x1`    |  1200 × 1800 |     54 |               30 |         144 | 1092 × 1548             |

Lebar dasar 600 px untuk strip vertikal, 1200 px untuk grid dan satu foto. Slot punya margin luar 4,5%, jarak 2,5%, dan footer 12%. Foto dipotong dari tengah supaya memenuhi slot tanpa distorsi.

## Struktur berkas proyek

```text
src/
  app/
    layout.tsx                 Kerangka halaman, metadata, font dan provider
    page.tsx                   Halaman utama yang menampilkan Studio
    globals.css                Semua gaya dan tata letak
    api/themes/                Route pemindai paket tema
  components/                  Header dan pembungkus tema
  features/
    studio/                    Kamera, sesi, unggah, tata letak dan ekspor
    editor/                    Kanvas, panel dan riwayat edit
  shared-tools/
    catalog/                   Katalog template, tema, font, filter, stiker
    composition/               Tipe, geometri, renderer, ekspor dan latar
    session.ts                 Aturan perubahan sesi foto
    image-upload.ts            Validasi dan pemrosesan unggahan
    async.ts                   Penundaan yang bisa dibatalkan
  translations/
    locales/                   Kamus tujuh bahasa
    types.ts                   Kontrak bentuk terjemahan
    use-language.tsx           Provider dan pilihan bahasa
  assets/fonts/                Font lokal dan lisensinya
public/
  assets/app-icons/            Ikon aplikasi
  assets/brand/                Logo
  assets/theme-packs/          Paket tema
  manifest.json                Metadata aplikasi web
scripts/                       Pemeriksaan dan pengemasan server
tests/                         Pengujian otomatis
```

## Alur kode: file mana memanggil apa

Website tidak dimulai dengan menjalankan setiap file secara manual. Perintah `npm run dev` menyalakan Next.js; Next.js membaca aturan dan halaman proyek, kemudian React menampilkan komponen. Saat pengguna melakukan sesuatu, komponen memanggil hook dan fungsi yang mengerjakan bagian tugasnya.

Alur ringkas saat membuka dan memakai PhotoPip:

```text
npm run dev
  → Next.js menjalankan aplikasi
  → src/app/layout.tsx menyiapkan kerangka, gaya, font, bahasa, tema, dan header
  → src/app/page.tsx menampilkan src/features/studio/studio.tsx
  → Studio mengatur sesi foto dan memilih: ambil foto atau unggah
  → semua slot terisi: Studio menyerahkan Composition ke Editor
  → Editor mengubah Composition dan meminta kanvas dirender ulang
  → tombol unduh: fungsi ekspor merender Composition ke kanvas sementara
  → browser mengunduh PNG atau JPEG ke perangkat
```

Langkah demi langkah:

1. **Next.js menemukan halaman utama.** `src/app/page.tsx` adalah halaman `/`; isinya menampilkan komponen `Studio`.
2. **Layout membungkus halaman.** `src/app/layout.tsx` memasang stylesheet, font lokal, header, penyedia bahasa, dan penyedia tema. `src/app/globals.css` mengatur tampilan. Halaman dan layout awal dapat dirender di server; fitur kamera dan kanvas berjalan di browser.
3. **Studio mengurus sesi.** `src/features/studio/studio.tsx` menyatukan pemilih tata letak, kamera, unggahan, status sesi, dan perpindahan antara tahap ambil foto dan edit. `src/features/studio/hooks/use-capture-session.ts` menjalankan alur pengambilan/unggah dan memakai `src/shared-tools/session.ts` untuk menambah, mengganti, atau mengosongkan foto. Data unggahan diproses oleh `src/shared-tools/image-upload.ts`.
4. **Foto menjadi komposisi.** Setelah semua slot terisi, Studio membuat `Composition`: satu paket data berisi cetakan, foto, tema, stiker, teks, dan filter. Saat retake, foto yang dipilih diganti, sedangkan draf hiasan tetap dibawa kembali ke editor.
5. **Editor mengubah paket tersebut.** `src/features/editor/editor.tsx` mengatur panel dan perubahan tema, foto, stiker, teks, serta properti. `src/features/editor/hooks/use-editor-canvas.ts` membuat kanvas Fabric, menyesuaikan ukuran tampilannya, lalu meminta renderer menggambar ulang ketika komposisi berubah.
6. **Renderer menggambar semua lapisan.** `src/shared-tools/composition/render.ts` memakai ukuran dari `geometry.ts` dan menggabungkan latar, bingkai, foto, artwork, logo, stiker, dan teks. Renderer bersama ini dipakai editor dan ekspor agar hasilnya konsisten.
7. **Ekspor membuat unduhan.** `src/shared-tools/composition/export.ts` membuat kanvas sementara, memanggil renderer, mengubah gambar menjadi PNG/JPEG, lalu membantu browser mengunduhnya. Kanvas sementara dibersihkan setelah tugas selesai.

Paket tema punya jalur tambahan: `src/app/api/themes/route.ts` menerima permintaan `GET /api/themes`, lalu `scan.ts` membaca dan memvalidasi folder di `public/assets/theme-packs/`. Katalog tema di browser memakai hasil itu untuk memberi pilihan tema dan URL artwork kepada Studio/Editor. Foto pengguna tidak melewati route ini.

Saat ingin belajar, ikuti satu contoh dari awal sampai akhir—misalnya klik tombol unduh—daripada mencoba membuka semua berkas sekaligus. Mulai dari file pemanggil, lalu ikuti fungsi yang diimpornya.

## Cara mengubah bagian website

| Tujuan             | Bagian utama                                |
| ------------------ | ------------------------------------------- |
| Tampilan dan warna | `src/app/globals.css`                       |
| Metadata dan font  | `src/app/layout.tsx`                        |
| Header             | `src/components/header.tsx`                 |
| Kamera dan sesi    | `src/features/studio/`                      |
| Editor             | `src/features/editor/`                      |
| Tata letak cetak   | `src/shared-tools/catalog/templates.ts`     |
| Stiker             | `src/shared-tools/catalog/stickers.ts`      |
| Filter             | `src/shared-tools/catalog/photo-filters.ts` |
| Tema               | `src/shared-tools/catalog/themes.ts`        |
| Paket tema         | `public/assets/theme-packs/`                |
| Geometri slot      | `src/shared-tools/composition/geometry.ts`  |
| Renderer           | `src/shared-tools/composition/render.ts`    |
| Ekspor             | `src/shared-tools/composition/export.ts`    |
| Terjemahan         | `src/translations/locales/`                 |

### Menambah tata letak

Tambahkan ID baru ke katalog template. Lengkapi label di tujuh bahasa. Semua paket tema harus punya file artwork untuk template baru.

### Menambah stiker

Stiker adalah SVG yang disematkan sebagai data URL. Pakai `viewBox="0 0 100 100"`. Tambahkan ID unik, nama, dan tag pencarian.

### Menambah filter

Tambahkan ID filter ke tipe, katalog, renderer, dan semua locale. Filter harus diterapkan di renderer bersama.

### Menambah bahasa

Bahasa saat ini: `id`, `en`, `es`, `fr`, `de`, `ja`, `zh`. Default Indonesia. Setiap kunci UI harus ada di semua bahasa.

## Aturan penting saat mengembangkan

- Buat objek/array baru saat mengubah Composition, Session, atau katalog. Jangan ubah data lama langsung.
- Jumlah foto harus sama dengan jumlah slot sebelum render.
- `photoFilters` harus sejajar urutannya dengan `photos`.
- Sesi tidak boleh melebihi jumlah slot.
- Geometri slot harus berada di dalam kanvas dan di atas footer logo.
- Jangan menjalankan API browser (`window`, `document`, `navigator`) saat server merender.
- Semua teks UI harus diterjemahkan ke tujuh locale.
- Semua gaya ada di satu file `globals.css`. Jangan menambah Tailwind atau CSS module.
- Aplikasi tidak menyimpan foto secara permanen.
- Operasi asinkron baru harus bisa dibatalkan dan dibersihkan.
- Jangan menambah dependency tanpa menilai kebutuhan, lisensi, dan keamanan.

## Pengujian dan pemeriksaan

Tes otomatis memakai Vitest, jsdom, dan Testing Library. Tes ada di folder `tests/`.

Yang dicek otomatis:

- Geometri template, cropping, batas stiker/teks, undo/redo
- State kamera, izin, timeout, abort, cleanup
- Validasi paket tema
- Paritas terjemahan

Tes otomatis tidak membuktikan hasil visual, kualitas cetak, atau kamera perangkat nyata.

Sebelum menyerahkan perubahan, jalankan:

```bash
npm run verify
```

## Pemecahan masalah

### Kamera tidak menyala

Pastikan halaman dibuka lewat HTTPS atau localhost, izin kamera diberikan, dan tidak ada aplikasi lain yang memakai kamera.

### Stiker atau foto tidak terlihat

Cek console. Gambar wajib yang gagal dimuat bisa membatalkan render. SVG stiker harus mandiri dan punya ukuran intrinsik.

### Teks bergeser saat halaman dimuat

Aplikasi memakai font lokal Google Sans Flex. Jangan ubah ke font jarak jauh tanpa menguji.

### Editor kosong atau stuck di “Processing…”

Pastikan canvas element sudah terpasang sebelum Fabric dibuat. Cek ukuran `.canvas-wrap` tidak nol.

### Aset 404 di server standalone

Jalankan `npm run build` dulu, baru `npm start`. Build menyalin `public/` ke folder standalone.

### Paket tema tidak muncul

Buka `/api/themes` dan lihat bagian diagnostics. Pastikan lima file PNG ukuran tepat, `theme.json` valid, dan ID folder benar. Muat ulang halaman setelah menambah paket.

### Artwork menutupi foto

Artwork digambar di depan foto. Area yang ingin memperlihatkan foto harus transparan dan sejajar dengan slot.

## Hal yang memang belum tersedia

PhotoPip saat ini belum punya:

- Penyimpanan foto permanen
- Akun pengguna
- Server upload
- Berbagi tautan
- Hapus atau susun ulang foto satu per satu
- Crop/pan manual di dalam slot
- Upload drag-and-drop
- Gestur pinch/pan untuk zoom

Fitur-fitur di atas butuh keputusan produk tersendiri.

## Lisensi font

Font Google Sans Flex memakai lisensi OFL. File lisensi ada bersama aset font. Pertahankan lisensi saat mengubah atau mendistribusikan ulang font.
