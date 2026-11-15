# PhotoPip

PhotoPip adalah bilik foto yang berjalan di browser. Pilih bentuk cetakan, ambil atau unggah foto, hias hasilnya, lalu unduh sebagai PNG atau JPEG.

Panduan ini menjelaskan aplikasi dari sudut pandang pengguna dan orang yang baru belajar membuat website. Istilah teknis dijelaskan saat pertama kali muncul. Semua informasi penting proyek disatukan di berkas ini; tidak perlu membuka dokumen lain untuk memahami cara kerja dan aturan dasarnya.

## Isi panduan

- [Mulai menggunakan PhotoPip](#mulai-menggunakan-photopip)
- [Privasi dan penyimpanan](#privasi-dan-penyimpanan)
- [Teknologi yang digunakan](#teknologi-yang-digunakan)
- [Fitur dan alur kerja](#fitur-dan-alur-kerja)
- [Istilah sederhana](#istilah-sederhana)
- [Cara gambar dirakit](#cara-gambar-dirakit)
- [Ukuran cetak dan kualitas](#ukuran-cetak-dan-kualitas)
- [Paket tema](#paket-tema)
- [Struktur berkas proyek](#struktur-berkas-proyek)
- [Cara menjalankan proyek](#cara-menjalankan-proyek)
- [Cara mengubah bagian website](#cara-mengubah-bagian-website)
- [Aturan penting saat mengembangkan](#aturan-penting-saat-mengembangkan)
- [Pengujian dan pemeriksaan](#pengujian-dan-pemeriksaan)
- [Pemecahan masalah](#pemecahan-masalah)
- [Hal yang memang belum tersedia](#hal-yang-memang-belum-tersedia)

## Mulai menggunakan PhotoPip

1. Pilih tata letak cetakan.
2. Izinkan penggunaan kamera, atau pilih foto dari perangkat.
3. Ambil foto satu per satu atau gunakan pengambilan otomatis.
4. Jika perlu, ambil ulang salah satu foto.
5. Setelah semua slot berisi foto, buka editor.
6. Pilih tema, filter, stiker, atau teks.
7. Pilih PNG atau JPEG, ukuran 1×, 2×, atau 3×, lalu unduh.

Kamera hanya dimulai setelah tombol kamera ditekan. Kamera membutuhkan halaman HTTPS atau `http://localhost`; browser biasanya menolak kamera pada alamat jaringan biasa seperti `http://192.168.1.5`.

## Privasi dan penyimpanan

Foto dari kamera dan unggahan diproses di perangkat. Tidak ada endpoint yang mengirim foto ke server, tidak ada basis data foto, dan tidak ada akun. Server aplikasi memiliki satu endpoint aplikasi, `GET /api/themes`, yang membaca metadata dan berkas paket tema dari folder website.

Foto sementara disimpan sebagai data URL di memori halaman. Data URL adalah teks yang memuat gambar, bukan alamat internet. Saat ekspor, browser menggambar hasil ke kanvas dan membuat unduhan di perangkat.

Foto, komposisi, stiker yang ditempel, dan pilihan format/skala ekspor tidak disimpan setelah halaman dimuat ulang atau ditutup. Pilihan bahasa disimpan di penyimpanan lokal browser. Pilihan tema terang/gelap dikelola oleh `next-themes` dan juga dapat disimpan di browser. Jangan menjanjikan bahwa hasil foto bisa dipulihkan setelah refresh.

## Teknologi yang digunakan

Kumpulan teknologi yang dipakai untuk membangun website biasa disebut **tech stack**. Bayangkan seperti alat-alat dalam bengkel: ada alat untuk merakit tampilan, mengatur halaman, menggambar foto, dan memeriksa hasil kerja.

| Teknologi                     | Gunanya dalam bahasa sederhana                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JavaScript**                | Bahasa dasar yang membuat website bisa bereaksi saat tombol ditekan, foto dipilih, atau panel dibuka.                                                                           |
| **TypeScript**                | JavaScript yang dilengkapi pemeriksaan jenis data. Ia membantu menemukan kekeliruan lebih awal, misalnya ketika fungsi yang mengharapkan foto justru diberi angka.              |
| **React**                     | Alat untuk menyusun tampilan dari komponen kecil yang bisa dipakai bersama, seperti header, tombol, panel kamera, dan editor. React juga memperbarui bagian layar yang berubah. |
| **Next.js**                   | Kerangka utama website yang memakai React. Next.js mengatur halaman, menyiapkan server pengembangan/build produksi, dan menyediakan route server seperti `/api/themes`.         |
| **Fabric.js**                 | Alat untuk mengelola kanvas editor: memilih, menggeser, mengubah ukuran, dan memutar foto, stiker, serta teks.                                                                  |
| **CSS**                       | Aturan tampilan: warna, jarak, ukuran, susunan panel, serta penyesuaian layar kecil dan besar. PhotoPip memakai satu stylesheet utama, `src/app/globals.css`.                   |
| **Node.js**                   | Program yang menjalankan alat proyek di komputer pengembang dan server Next.js. JavaScript di browser tetap dijalankan oleh browser.                                            |
| **npm**                       | Alat untuk memasang pustaka yang dibutuhkan dan menjalankan perintah proyek seperti `npm run dev` atau `npm test`.                                                              |
| **Vitest**                    | Alat tes otomatis. Ia menjalankan pemeriksaan kecil untuk memastikan aturan seperti geometri slot atau pergantian foto tetap bekerja.                                           |
| **Testing Library dan jsdom** | Membantu mengetes komponen React di lingkungan tiruan browser, tanpa harus membuka jendela browser sungguhan untuk setiap tes.                                                  |
| **ESLint**                    | Memeriksa pola kode dan menandai masalah yang berpotensi membingungkan atau menyebabkan bug.                                                                                    |
| **Prettier**                  | Merapikan format kode dan Markdown secara otomatis agar gaya penulisannya konsisten.                                                                                            |
| **Knip**                      | Mencari berkas, fungsi, atau pustaka yang terpasang tetapi tidak digunakan.                                                                                                     |

Sebagian alat dipakai oleh website saat berjalan, seperti React, Next.js, dan Fabric.js. Sebagian lain hanya membantu orang yang mengembangkan atau memeriksa proyek, seperti Vitest, ESLint, Prettier, dan Knip. Jadi, tidak semua alat di atas diunduh pengunjung sebagai bagian dari fitur website.

Versi pustaka yang dipasang tercatat di `package.json` dan `package-lock.json`. Angka versi dapat berubah saat proyek diperbarui; daftar di atas menjelaskan peran alat, bukan menjamin versi tertentu.

## Fitur dan alur kerja

### Tata letak cetakan

Tersedia lima tata letak:

| ID    | Nama            | Ukuran cetak | Jumlah foto | Susunan               |
| ----- | --------------- | ------------ | ----------: | --------------------- |
| `4x1` | Strip klasik    | 2 × 6 inci   |           4 | Satu kolom vertikal   |
| `3x1` | Strip tiga foto | 2 × 4,5 inci |           3 | Satu kolom vertikal   |
| `2x3` | Grid            | 4 × 6 inci   |           6 | Dua kolom, tiga baris |
| `2x2` | Grid persegi    | 4 × 4 inci   |           4 | Dua kolom, dua baris  |
| `1x1` | Satu foto       | 4 × 6 inci   |           1 | Satu foto besar       |

Pemilihan tata letak menunjukkan miniatur, nama, jumlah foto dan ukuran. Daftar pilihan dapat membuka ke atas jika ruang di bawah tombol tidak cukup. Tombol Escape menutup daftar dan mengembalikan fokus ke tombol pemilih. Mengganti tata letak menghapus foto yang sudah diambil karena jumlah dan bentuk slot dapat berbeda; bila foto ada, aplikasi meminta konfirmasi terlebih dahulu.

### Kamera dan pengambilan

Kamera meminta video depan dengan ukuran ideal 1280 × 960 tanpa audio. Browser dan perangkat boleh memilih ukuran lain. Aplikasi menunggu video siap serta satu frame gambar yang dapat digunakan; jika tidak siap dalam 10 detik, kamera melaporkan masalah kesiapan.

Timer shutter dapat diatur ke 0, 3, atau 5 detik. Setelah foto diambil, layar memberi kilatan singkat. Pengambilan otomatis mengambil semua slot yang tersisa: foto pertama memakai timer pilihan, foto berikutnya memakai jeda 5 detik. Tombol batal menghentikan hitung mundur/urutan berikutnya, tetapi foto yang sudah berhasil diambil tetap ada.

Kamera dihentikan setelah sesi pengambilan selesai, saat retake dimulai, reset, masuk editor, halaman disembunyikan, atau komponen dibersihkan. Jika kamera terputus, aplikasi menampilkan pesan. Pembukaan stream yang terlambat setelah pembatalan juga dihentikan, bukan dipasang kembali ke halaman.

Kode masalah kamera yang digunakan:

| Kode          | Arti sederhana                                                                   |
| ------------- | -------------------------------------------------------------------------------- |
| `denied`      | Izin ditolak atau diblokir kebijakan browser                                     |
| `missing`     | Kamera tidak ditemukan atau tidak mendukung batasan yang diminta                 |
| `busy`        | Kamera sedang dipakai, atau stream terputus                                      |
| `unavailable` | Kemampuan kamera tidak tersedia atau kesalahan lain                              |
| `readiness`   | Stream ada, tetapi tidak menghasilkan frame yang dapat dipakai dalam batas waktu |
| `capture`     | Frame atau pembacaan kanvas gagal                                                |

### Retake dan perpindahan mode

Website mempunyai dua fase: mengambil foto dan mengedit. Editor hanya dibuka setelah jumlah foto lengkap. Ketika kembali untuk retake, draf komposisi tetap disimpan: tema, stiker, teks, dan filter tetap ada. Foto pada slot yang dipilih diganti tepat satu; filter slot tersebut tetap berlaku. Foto tidak dapat dihapus satu per satu atau diurutkan ulang.

Reset memulai sesi baru dan membuang foto serta draf. Jika ada foto, dialog konfirmasi mencegah kehilangan yang tidak disengaja. Memuat ulang halaman tetap menghapus seluruh sesi.

### Unggah foto

Pemilih berkas menerima tipe gambar. Berkas diproses satu per satu dan hanya sebanyak slot yang masih kosong. Saat retake, tepat satu berkas digunakan untuk mengganti slot yang ditandai. Memilih berkas yang sama lagi dimungkinkan karena nilai input berkas dikosongkan setelah pemilihan.

Aplikasi menerima berkas berdasarkan MIME type atau ekstensi `avif`, `bmp`, `gif`, `heic`, `heif`, `jpg`, `jpeg`, `png`, dan `webp`. Gambar didekode di browser, diperkecil sehingga sisi terpanjang paling banyak 2000 piksel, latar transparan diratakan ke putih, lalu dikodekan menjadi JPEG kualitas 0,92. Format HEIC/HEIF hanya bisa digunakan jika browser mampu mendekodenya. Berkas tak valid, gagal dibaca, atau gagal diproses tidak mengubah sesi.

Unggah tidak tersedia saat pengambilan sedang berjalan atau semua slot sudah penuh. Unggah beberapa kali diperbolehkan jika belum semua slot terisi.

### Editor

Editor memuat kanvas Fabric.js hanya ketika dibutuhkan, bukan saat halaman awal dibuka. Ada lima panel: Tema, Foto, Stiker, Teks, dan Properti. Panel berada di samping kanvas pada layar lebar, dan berpindah ke bawah kanvas pada layar sempit.

Kanvas mempertahankan koordinat ukuran cetak. Ukuran tampilannya diubah melalui CSS agar posisi objek tidak berubah karena ukuran layar. Biasanya kanvas dicocokkan dengan lebar dan tinggi ruang. Pada layar berlebar maksimal 899 px, untuk strip tinggi dengan tinggi lebih dari 1,5 kali lebarnya, kanvas dicocokkan dengan lebar agar tetap mudah diedit; bagian yang memanjang dapat digulir vertikal. Jadi seluruh strip tidak selalu terlihat sekaligus.

Zoom tampilan dari 50% hingga 400%, dalam langkah 25%. Tombol persentase mengembalikan zoom ke 100%. Zoom hanya mengubah tampilan editor, bukan ukuran file unduhan. Saat zoom lebih dari 100%, area kanvas dapat digulir.

Foto, stiker, atau teks dapat dipilih di kanvas maupun daftar lapisan. Objek dapat digeser, diubah ukuran, diputar, dibalik, serta diatur opasitasnya. Mengubah ukuran teks mengubah ukuran huruf. Posisi/ukuran teks dan stiker dibatasi ke wilayah kanvas; objek yang berada dekat tepi masih dapat tampak sebagian keluar karena titik posisinya adalah pusat objek.

Editor memiliki undo/redo sampai 40 langkah. Langkah menyimpan komposisi, bukan objek kanvas. Gerakan slider atau pengeditan teks yang berlangsung terus-menerus digabung menjadi satu langkah. Perubahan baru menghapus daftar redo.

Setiap perubahan komposisi menggambar ulang seluruh kanvas. Gambar dimuat lebih dulu; foto atau stiker yang gagal dimuat dapat menggagalkan render dan menampilkan tombol coba lagi. Gambar dekoratif opsional seperti artwork tema yang gagal dimuat dapat dilewati agar foto tetap tampil. Cache gambar dibatasi 24 URL.

### Tema

Tema adalah satu paket tampilan, bukan pilihan latar dan bingkai yang terpisah. Tema dapat menentukan latar, bingkai, warna teks, font, atau artwork PNG. Saat ini daftar preset bawaan kosong; `plain` adalah tema fallback putih yang dipakai jika ID tema tidak ditemukan, bukan kartu tema yang dapat dipilih. Kartu yang dapat dipilih berasal dari paket tema yang ditemukan.

Menerapkan tema mengubah ID tema dan memperbarui warna serta font semua teks yang sudah ada. Tema tidak menghapus atau menambah foto, teks, atau stiker. Jika gaya salah satu teks kemudian diubah sendiri, status tema bisa menjadi “Kustom”. Tombol “Acak” memilih tema lain jika tersedia; jika tidak ada tema, ia menggunakan fallback `plain`.

Kartu paket tema menampilkan artwork PNG untuk tata letak yang sedang dipilih di atas contoh slot netral. Ia tidak menggunakan `preview.png` sebagai gambar kartu. Nama paket berasal dari `theme.json` atau nama folder, tidak diterjemahkan.

### Filter foto

Filter berlaku hanya pada foto yang dipilih. Tersedia enam pilihan:

| ID        | Tampilan    |
| --------- | ----------- |
| `none`    | Asli        |
| `bw`      | Hitam putih |
| `warm`    | Hangat      |
| `cool`    | Sejuk       |
| `vintage` | Vintage     |
| `fade`    | Pudar       |

Filter disimpan per slot. Mengubah filter satu foto tidak mengubah filter foto lain. Filter diterapkan oleh renderer yang sama untuk pratinjau dan unduhan.

### Stiker dan teks

Katalog saat ini memiliki 15 stiker: sunglasses, mustache, crown, heart, star, bowtie, speechBubble, hat, glasses, wink, rainbow, peace, lightning, diamond, dan unicorn. Nama dan tag pencarian katalog menggunakan bahasa Inggris. Pencarian melihat nama serta tag dan dapat digabung dengan kategori Fun, Love, Cool, Fancy, atau All.

Stiker baru ditempatkan di tengah kanvas, ukuran awal 25% lebar kanvas, rotasi nol, opasitas penuh, tanpa flip. Setiap tempelan adalah objek tersendiri walau memakai desain stiker yang sama. Tombol “Bersihkan stiker” menghapus semua tempelan. Sumber gambar stiker disalin ke objek tempelan sehingga perubahan katalog tidak mengubah tempelan yang sudah ada dalam sesi itu.

Teks baru memakai teks bawaan terjemahan, warna dan font tema aktif (atau fallback `plain`), lalu dipilih agar dapat diedit. Teks maksimal 120 karakter; ukuran huruf minimum 18 piksel cetak. Teks kosong disimpan ketika pengguna sedang mengetik, tetapi tidak digambar pada hasil akhir. Panel teks mengatur isi, font, warna, posisi, ukuran, rotasi, opasitas, perataan, tebal dan miring.

Teks dan stiker dapat dibawa ke depan, dikirim ke belakang, diduplikasi, atau dihapus. Salinan digeser 24 piksel cetak dan dibatasi ke kanvas. Daftar lapisan menampilkan objek teratas lebih dulu.

### Ekspor

Format unduhan: PNG atau JPEG. Skala 1× adalah ukuran cetak dasar; 2× dan 3× menggandakan atau melipat-tigakan jumlah piksel di setiap sisi. Misalnya 600 × 1800 menjadi 1200 × 3600 pada 2×, dan 1800 × 5400 pada 3×. Skala tidak mengubah tata letak atau ukuran inci yang dipilih. JPEG memakai kualitas 0,95.

Ekspor membangun kanvas baru yang tidak terlihat, menggambar komposisi, membuat data gambar, lalu mengunduh berkas bernama `photopip-<waktu>.png` atau `.jpg`. Kanvas ekspor dibersihkan selalu, termasuk jika terjadi pembatalan atau error. Ekspor tidak bergantung pada kanvas editor; jadi bisa tetap dicoba ketika pratinjau editor gagal. Tidak ada indikator persentase proses. Ekspor besar mungkin membutuhkan waktu lebih lama.

## Istilah sederhana

| Istilah               | Artinya                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| Tata letak / template | Bentuk cetakan yang menetapkan ukuran, jumlah foto, dan susunan slot.                                       |
| Jenis tata letak      | Kelompok bentuk: vertikal, grid, atau satu foto. Ini bukan seluruh definisi template.                       |
| Slot                  | Persegi panjang tempat sebuah foto diletakkan; ukurannya dihitung, bukan disimpan sebagai gambar.           |
| Sesi                  | Kemajuan mengambil foto: tata letak, foto yang terkumpul, dan slot yang akan diulang.                       |
| Komposisi             | Semua bahan hasil: template, foto, tema, stiker, teks, dan filter.                                          |
| Draf                  | Komposisi yang sementara disimpan oleh aplikasi saat berpindah antara mengambil dan mengedit.               |
| Penempatan            | Satu salinan stiker atau teks dengan posisi dan gaya sendiri.                                               |
| Filter                | Efek warna pada satu foto.                                                                                  |
| Tema preset           | Paket tampilan yang diterapkan sekaligus.                                                                   |
| Paket tema            | Folder berisi artwork PNG dan informasi pilihan tema, ditemukan oleh server.                                |
| Artwork               | Gambar dekorasi PNG yang diletakkan di atas foto. Area transparan memperlihatkan lapisan di bawahnya.       |
| Bingkai               | Dekorasi opsional milik preset bawaan, berada di belakang foto dan dapat memiliki garis slot.               |
| Pratinjau             | Kanvas editor yang terlihat di layar.                                                                       |
| Ekspor                | Pembuatan berkas gambar pada perangkat, bukan pengiriman ke server.                                         |
| Zoom                  | Pembesaran tampilan editor saja.                                                                            |
| Skala ekspor          | Pengali jumlah piksel berkas unduhan. Berbeda dari zoom.                                                    |
| Data URL              | Teks yang memuat isi gambar, biasanya diawali `data:image/jpeg;base64,`.                                    |
| Render                | Proses menggambar semua lapisan menjadi satu gambar.                                                        |
| SSR                   | Server menyiapkan HTML awal. Bagian yang membutuhkan kamera atau kanvas browser tidak dijalankan di server. |
| AbortSignal           | Sinyal pembatalan untuk menghentikan pekerjaan asinkron seperti timer, kamera, atau render.                 |

## Cara gambar dirakit

Renderer yang sama dipakai untuk editor dan ekspor. Urutan lapisan dari belakang ke depan:

1. Latar: warna, gradasi, atau pola.
2. Bingkai preset opsional, jika ada.
3. Foto, satu per slot, dipotong tengah agar memenuhi slot tanpa meregang.
4. Garis tepi slot dari bingkai, jika tersedia.
5. Artwork paket tema di depan foto dan garis. Piksel transparan menunjukkan isi di bawahnya; piksel buram menutupinya.
6. Logo di area footer.
7. Stiker sesuai urutan susunan.
8. Teks tambahan.

Foto tetap berbentuk persegi panjang slot; transparansi artwork tidak membuat foto mengikuti bentuk lubang dekoratif. Karena artwork berada di depan, bagian artwork yang buram memang dapat menutupi foto. Perubahan visual yang ingin muncul sekaligus di pratinjau dan unduhan harus masuk ke jalur renderer bersama, bukan hanya CSS/kanvas editor.

Foto, stiker, dan artwork dimuat sebelum gambar baru ditempatkan. Foto/stiker yang wajib namun gagal dimuat dapat menggagalkan render; frame atau artwork dekoratif yang gagal dapat dilewati dan dicatat di console. Font browser ditunggu sebelum teks dibuat agar teks tidak digambar memakai font sementara.

## Ukuran cetak dan kualitas

Ukuran internal kanvas disebut piksel cetak. Tampilan editor menggunakan ukuran CSS yang lebih kecil tanpa mengubah koordinat gambar.

| Template | Kanvas dasar | Margin | Jarak antar-slot | Footer logo | Ukuran slot (perkiraan) |
| -------- | -----------: | -----: | ---------------: | ----------: | ----------------------- |
| `4x1`    |   600 × 1800 |     27 |               15 |          72 | 546 × 407,25            |
| `3x1`    |   600 × 1350 |     27 |               15 |          72 | 546 × 398               |
| `2x3`    |  1200 × 1800 |     54 |               30 |         144 | 531 × 496               |
| `2x2`    |  1200 × 1200 |     54 |               30 |         144 | 531 × 459               |
| `1x1`    |  1200 × 1800 |     54 |               30 |         144 | 1092 × 1548             |

Angka slot adalah piksel dan beberapa ukuran dapat pecahan di dalam perhitungan. Lebar dasar adalah 600 px untuk strip vertikal dan 1200 px untuk grid maupun satu foto. Tinggi mengikuti rasio cetak.

Slot punya margin luar 4,5% lebar kanvas, jarak 2,5%, dan footer 12%. Slot harus berada di dalam kanvas dan di atas footer. Ini menjaga logo tidak menindih foto. Rumus ukuran dan posisi berasal dari satu fungsi geometri bersama; jangan menghitung ulang berbeda di komponen UI.

Foto dipotong agar memenuhi slot tanpa distorsi: sisi gambar yang berlebih dipangkas dari tengah. Posisi objek dihitung dalam piksel cetak. Posisi, ukuran, rotasi, dan opasitas stiker/teks dinormalisasi agar tetap dalam nilai yang diizinkan. Perubahan konstanta geometri memengaruhi semua template dan berkas ekspor, jadi perlu alasan produk dan pengujian visual.

Ukuran piksel bukan jaminan yang sama untuk semua printer: hasil fisik juga bergantung pada pengaturan printer dan layanan cetak. Pada lebar 600 px untuk cetakan 2 inci, perkiraannya 300 piksel per inci; skala ekspor memperbanyak piksel keluaran.

## Paket tema

Paket tema adalah folder di `public/assets/theme-packs/<id>/`. Route Node.js `GET /api/themes` memeriksa folder saat diminta. Browser meminta katalog sekali ketika Studio dimuat; setelah menambah atau menghapus paket, muat ulang halaman.

Paket minimal membutuhkan lima PNG ini dengan dimensi tepat:

| Berkas       |      Ukuran | Isi                 |
| ------------ | ----------: | ------------------- |
| `4x1.png`    |  600 × 1800 | Empat slot vertikal |
| `3x1.png`    |  600 × 1350 | Tiga slot vertikal  |
| `2x3.png`    | 1200 × 1800 | Enam slot grid      |
| `2x2.png`    | 1200 × 1200 | Empat slot grid     |
| `single.png` | 1200 × 1800 | Satu slot besar     |

Gunakan nama `single.png`, bukan `1x1.png`; nama kedua dapat dianggap sebagai nama tracking pixel oleh penyaring browser. Berkas `2x3.png` dan `single.png` memiliki dimensi sama tetapi posisi slot berbeda, jadi tidak boleh dipertukarkan.

`preview.png` bersifat opsional. Jika ada, ia harus PNG, setiap sisi antara 64 dan 2048 px; gambar tidak persegi diterima dengan peringatan. URL-nya tetap dikirim oleh API, tetapi kartu tema saat ini menampilkan artwork sesuai template, bukan preview. File artwork di atas 8 MB dan preview di atas 1 MB menghasilkan peringatan ukuran.

Folder ID harus huruf kecil, angka, dan tanda hubung tunggal di antara bagian nama; panjang maksimal 40 karakter. Folder yang diawali `_` atau `.` diabaikan; `_starter` hanya contoh. Saat ini daftar ID tema bawaan yang dicadangkan kosong.

`theme.json` opsional dan maksimal 16 KB. Semua isinya opsional:

```json
{
  "name": "Neon Nights",
  "textColor": "#f8fafc",
  "fontId": "display",
  "backgroundColor": "#0b1020"
}
```

| Kolom             | Nilai bawaan                         | Aturan                                                    |
| ----------------- | ------------------------------------ | --------------------------------------------------------- |
| `name`            | Nama folder yang dibuat mudah dibaca | 1–60 karakter setelah spasi tepi dibuang                  |
| `textColor`       | `#20231f`                            | Warna `#rrggbb`; dipakai oleh teks tema                   |
| `fontId`          | `app`                                | Salah satu `app`, `serif`, `sans`, `mono`, `display`      |
| `backgroundColor` | `#ffffff`                            | Warna `#rrggbb`, terlihat melalui area artwork transparan |

Kunci JSON yang tidak dikenal diabaikan. JSON rusak atau nilai kolom tidak sah menolak seluruh paket, bukan diam-diam memakai nilai bawaan. Nama paket adalah isi paket, jadi tidak diterjemahkan.

Rancang artwork pada ukuran cetak dan simpan sebagai PNG dengan alpha/transparansi. Area foto yang ingin terlihat harus transparan dan sejajar dengan slot persegi panjang. Dekorasi dapat diletakkan di atas foto; bagian buram akan menutup foto. Logo digambar di footer bawah 12%, kemudian stiker dan teks berada lebih depan. Contoh paket `_starter` menunjukkan slot dan panduan transparansi.

Slot untuk desain artwork:

| Berkas       | Slot `(x, y, lebar, tinggi)`                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `4x1.png`    | `(27,27,546,407.25)`, `(27,449.25,546,407.25)`, `(27,871.5,546,407.25)`, `(27,1293.75,546,407.25)`                        |
| `3x1.png`    | `(27,27,546,398)`, `(27,440,546,398)`, `(27,853,546,398)`                                                                 |
| `2x3.png`    | `(54,54,531,496)`, `(615,54,531,496)`, `(54,580,531,496)`, `(615,580,531,496)`, `(54,1106,531,496)`, `(615,1106,531,496)` |
| `2x2.png`    | `(54,54,531,459)`, `(615,54,531,459)`, `(54,543,531,459)`, `(615,543,531,459)`                                            |
| `single.png` | `(54,54,1092,1548)`                                                                                                       |

API memeriksa identitas folder, ukuran manifest, isi JSON, warna/font, signature dan dimensi PNG dari header file, serta membentuk URL cache-busting `?v=<mtime>-<size>`. Ia tidak mendekode seluruh piksel artwork. Paket tak valid tidak dimasukkan; diagnostik tersedia dalam response `/api/themes` dan log server. File yang berubah mendapat URL baru agar cache gambar tidak menampilkan gambar lama.

Untuk deployment standalone, `npm run build` menyalin `public/` ke `.next/standalone/public/`. Paket harus ada sebelum build untuk deployment immutable/container/serverless. Pada server standalone yang bisa ditulis, folder yang ditambahkan langsung di direktori salinan dapat ditemukan pada request berikutnya; jangan menganggap cara ini tersedia di hosting immutable.

## Struktur berkas proyek

```text
src/
  app/
    layout.tsx                 Kerangka halaman, metadata, font dan provider
    page.tsx                   Halaman utama yang menampilkan Studio
    globals.css                Seluruh gaya dan tata letak
    api/themes/                Route pemindai paket tema
  components/                  Header dan pembungkus penyedia tema
  features/
    studio/                    Kamera, sesi, unggah, tata letak dan ekspor
    editor/                    Kanvas, panel tema/foto/stiker/teks/properti
  shared-tools/
    catalog/                   Katalog template, tema, font, filter, stiker
    composition/               Tipe, geometri, latar, renderer dan ekspor
    session.ts                 Aturan perubahan sesi foto
    image-upload.ts            Pemeriksaan, pemrosesan dan konversi unggahan
    async.ts                   Bantuan penundaan yang bisa dibatalkan
  translations/
    locales/                   Kamus Indonesia, Inggris, Spanyol, Prancis, Jerman, Jepang, Mandarin
    types.ts                   Bentuk wajib semua terjemahan
    use-language.tsx           Pilihan bahasa dan penyimpanannya
  assets/fonts/                Font lokal dan lisensinya
public/
  assets/app-icons/            Ikon aplikasi
  assets/brand/                Logo
  assets/theme-packs/          Paket tema yang ditemukan saat berjalan
  manifest.json                Metadata aplikasi web
scripts/                       Pemeriksaan audit dan pengemasan server
tests/                         Pengujian otomatis
```

Halaman memakai Next.js App Router. Layout dan halaman awal dapat disiapkan server, sedangkan Studio dan alat browser berjalan sebagai komponen klien. Editor dimuat secara dinamis karena Fabric.js membutuhkan DOM. Modul geometri dan reducer sesi adalah logika murni; renderer, kamera, unggahan, font tertentu dan ekspor menggunakan API browser dan tidak boleh dieksekusi ketika server merender halaman.

Server tidak memiliki route foto, autentikasi, database, atau server action. `/api/themes` adalah route aplikasi saja. Browser tetap mengunduh HTML, JavaScript, CSS, font, logo, ikon dan artwork statis dari server seperti situs biasa.

Header menyediakan tautan kembali ke `/`, pemilih bahasa, dan tombol terang/gelap. Tautan merek adalah navigasi normal: ia tidak menampilkan peringatan foto belum diunduh. Halaman memiliki skip link menuju isi utama. Metadata meliputi judul, deskripsi, Open Graph, manifest, dan ikon. `NEXT_PUBLIC_SITE_URL` mengatur URL dasar; nilai bawaan `http://localhost:3000` untuk pengembangan. Header keamanan berada di `next.config.mjs`, termasuk izin kamera untuk origin sendiri (`camera=(self)`), larangan mikrofon/lokasi, `nosniff`, kebijakan referrer, dan larangan framing.

## Cara menjalankan proyek

Persyaratan pengembangan: Node.js versi 22 atau lebih baru dan npm 11. Dari folder utama proyek:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Kamera dapat diuji melalui localhost atau HTTPS. `NEXT_PUBLIC_SITE_URL` opsional untuk pengembangan; atur di produksi supaya URL metadata mengarah ke domain sebenarnya. `PORT` dapat memilih port server standalone.

Perintah yang tersedia:

| Perintah                               | Kegunaan                                                         |
| -------------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                          | Menyalakan server pengembangan dengan Turbopack                  |
| `npm run build`                        | Membuat build produksi dan menyiapkan server standalone          |
| `npm start`                            | Menjalankan `.next/standalone/server.js` setelah build           |
| `npm run format`                       | Memformat berkas proyek termasuk Markdown                        |
| `npm run format:check`                 | Memeriksa format tanpa mengubah berkas                           |
| `npm run type-check`                   | Memeriksa TypeScript tanpa membuat build produksi                |
| `npm run lint`                         | Memeriksa aturan kode; peringatan dianggap gagal                 |
| `npm test`                             | Menjalankan pengujian Vitest sekali                              |
| `npx vitest`                           | Menjalankan Vitest dalam mode pantau                             |
| `npx vitest run tests/camera.test.tsx` | Menjalankan tes kamera saja                                      |
| `npm run deadcode`                     | Mencari berkas, ekspor, atau dependensi tak terpakai dengan Knip |
| `npm run audit:production`             | Memeriksa kerentanan dependensi produksi                         |
| `npm run verify`                       | Menjalankan semua pemeriksaan dan build dalam urutan proyek      |

`npm run verify` menjalankan cek format, tipe, lint, tes, dead-code, audit dependensi dan build. Gate ini tidak membuktikan bahwa penjelasan di README cocok dengan source; fakta dokumentasi tetap perlu dibandingkan dengan kode.

Build standalone menyalin `.next/static/` dan `public/` ke direktori standalone. Jika halaman HTML muncul tetapi aset 404 saat `npm start`, build atau pengemasan aset kemungkinan belum benar. Jangan edit hasil build `.next/` atau `tsconfig.tsbuildinfo` secara manual; keduanya hasil generasi.

## Cara mengubah bagian website

| Tujuan                           | Bagian utama                                                              |
| -------------------------------- | ------------------------------------------------------------------------- |
| Tampilan, warna dan tata letak   | `src/app/globals.css`                                                     |
| Metadata, font dan provider root | `src/app/layout.tsx`                                                      |
| Header                           | `src/components/header.tsx`                                               |
| Halaman utama                    | `src/app/page.tsx`                                                        |
| Kamera dan sesi foto             | `src/features/studio/`                                                    |
| Panel serta interaksi editor     | `src/features/editor/`                                                    |
| Tata letak cetak                 | `src/shared-tools/catalog/templates.ts`                                   |
| Stiker                           | `src/shared-tools/catalog/stickers.ts`                                    |
| Filter foto                      | `src/shared-tools/catalog/photo-filters.ts` dan renderer                  |
| Tema bawaan dan fallback         | `src/shared-tools/catalog/themes.ts`                                      |
| Paket tema di disk               | `public/assets/theme-packs/`                                              |
| Geometri slot                    | `src/shared-tools/composition/geometry.ts`                                |
| Susunan gambar akhir             | `src/shared-tools/composition/render.ts`                                  |
| Format dan pembuatan unduhan     | `src/shared-tools/composition/export.ts`, panel ekspor dan hook ekspor    |
| Terjemahan                       | `src/translations/locales/` dan kontraknya di `src/translations/types.ts` |
| Route tema                       | `src/app/api/themes/`                                                     |
| Pengujian                        | `tests/`                                                                  |
| Pemeriksaan build/audit          | `scripts/`                                                                |

### Menambah tata letak

Tambahkan ID baru ke katalog template; jangan mengganti atau menggunakan ulang ID lama karena ID adalah kunci pilihan. Lengkapi labelnya di ketujuh bahasa. Periksa jumlah slot, batas kanvas, footer, miniatur dan film strip. Jika menambah jenis tata letak baru selain `vertical`, `grid`, atau `single`, fungsi geometri dan gaya miniatur perlu memahami jenis baru. Semua paket tema tetap memerlukan file artwork untuk setiap template, dengan ukuran yang dihitung dari geometri.

### Menambah stiker

Stiker adalah SVG tertanam sebagai data URL. Gunakan SVG mandiri tanpa gambar/font dari internet, dengan `viewBox="0 0 100 100"`. Pembantu katalog menambahkan ukuran intrinsik 100 × 100; browser memerlukan ukuran ini untuk menggambar SVG pada kanvas. SVG berisi teks non-Latin-1 dapat membuat `btoa` gagal; gunakan entitas/nilai numerik atau mekanisme encoding yang benar jika diperlukan. Tambahkan ID unik, nama dan tag pencarian. Uji tampilan, drag, dan ekspor.

### Menambah filter foto

Tambahkan ID filter ke tipe, katalog pilihan, logika Fabric di renderer, dan label pada semua tujuh locale. Filter harus diterapkan di renderer bersama, bukan hanya pada tampilan miniatur; jika tidak, ekspor dapat berbeda dari pratinjau. Pastikan filter satu slot tidak mengubah slot lain.

### Menambah font teks

Daftar font teks saat ini memakai font sistem: app, serif, sans, mono, display. Tambahkan stack font sistem dan label terjemahan. Aplikasi juga memakai font antarmuka lokal Google Sans Flex dari berkas WOFF2 dengan lisensi OFL; jangan menghapus lisensinya. Saat mengganti pemuatan font, pertahankan fallback yang ukurannya disesuaikan agar halaman tidak bergeser saat font utama dimuat.

### Menambah bahasa

Bahasa saat ini `id`, `en`, `es`, `fr`, `de`, `ja`, `zh`; default Indonesia. Kontrak `Messages` menentukan semua teks. Tambahkan bahasa ke daftar, nama tampilan, file kamus bertipe, dan registry. Setiap kunci UI harus ada di semua bahasa; TypeScript dan tes paritas membantu menemukan yang tertinggal. Uji teks panjang dan keterbacaan pada layar sempit. Nama stiker dan nama paket tema adalah data katalog, bukan teks antarmuka, sehingga saat ini tidak diterjemahkan.

### Menambah tema bawaan

Tema bawaan disimpan di katalog tema. Daftar bawaan saat ini kosong. Tema dapat menyediakan latar warna, gradasi atau pola, bingkai SVG opsional, warna teks dan font. Gradasi yang dikenali renderer harus berbentuk seperti `linear-gradient(90deg, #112233 0%, #ffffff 100%)`; parser membaca warna heksadesimal dan persentase. Pola yang tersedia: stripes, dots, checker. Bila menambah pola, renderer latar dan miniatur harus menggambarkan pola yang sama.

Bingkai adalah SVG data URL yang diskalakan ke seluruh kanvas dan digambar di belakang foto. `slotStroke` menjadi garis tepi foto. Uji semua template dan kontras teks. ID preset harus ditambahkan ke daftar ID tema bawaan yang dipakai scanner agar paket disk tidak menimpa ID tersebut.

### Menambah alat editor atau format ekspor

Untuk alat baru, alat itu perlu tipe tab, tombol rail, panel, pemilihan panel, terjemahan, gaya, dan renderer bila memengaruhi gambar akhir. Untuk format ekspor baru, periksa dukungan `toDataURL`, validasi hasil data URL, ekstensi nama file, pilihan UI, dan kualitas untuk format lossy. Jangan mengubah geometri cetak sebagai efek samping perubahan UI.

## Aturan penting saat mengembangkan

- Buat objek/array baru saat mengubah `Composition`, `Session`, atau katalog. Jangan mengubah data lama langsung; UI/editor dan ekspor bergantung pada identitas objek.
- Sebelum render, jumlah foto harus sama dengan jumlah slot template. Renderer menolak komposisi tidak lengkap.
- `photoFilters` harus sejajar urutannya dengan `photos`; entri yang hilang memakai `none`, tetapi array salah urut dapat memberi filter ke foto yang keliru.
- Sesi foto tidak boleh melebihi jumlah slot. Retake mengganti tepat satu slot dan menghapus penanda retake setelah foto baru diterima.
- Geometri slot harus berada di dalam kanvas dan tidak masuk footer logo.
- Sticker size dibatasi 30 sampai lebar kanvas; koordinat dibatasi ke kanvas; rotasi dinormalisasi ke 0–<360 derajat. Teks maksimal 120 karakter, ukuran minimal 18 px cetak, posisi dibatasi, opasitas 0–1.
- Source dan nama stiker disalin ke placement agar komposisi sesi tidak bergantung pada perubahan katalog.
- Canvas internal berukuran piksel cetak; display diubah lewat CSS (`cssOnly`). Jangan mengubah koordinat objek agar cocok dengan layar.
- Kanvas ekspor harus selalu di-dispose, termasuk setelah abort/error.
- Paket tema selalu punya URL cache-busted `?v=<mtime>-<size>`. Jangan menghapus versi URL tanpa memahami cache gambar.
- Paket tema digambar di depan foto; transparansi adalah bagian dari kontrak desain.
- Jangan menjalankan `window`, `document`, `navigator`, `localStorage`, Fabric, atau API browser saat server merender.
- Semua teks UI harus diterjemahkan ke tujuh locale. Jangan menulis kalimat Inggris langsung di komponen.
- Semua gaya berada di satu stylesheet global `src/app/globals.css`; jangan menambahkan Tailwind, CSS module, atau CSS-in-JS.
- Aplikasi tidak memiliki penyimpanan foto. Jangan menambahkan simpan otomatis tanpa keputusan produk dan strategi penyimpanan yang aman; data URL dapat berukuran besar.
- Operasi asinkron baru perlu pembatalan dan pembersihan timer, event listener, stream, atau object URL.
- Jangan menambah, menghapus, atau menaikkan dependency tanpa menilai kebutuhan, lisensi, perawatan dan audit keamanan.

### Data utama dalam bahasa sederhana

`Template` adalah cetakan yang dibagikan semua sesi. `Session` hanya menyimpan tata letak, foto, dan slot yang akan diulang. `Composition` adalah bahan lengkap untuk gambar hasil. `Stage` memilih apakah tampilan sedang capture atau edit, dan membawa draf selama perpindahan. `StickerPlacement` dan `TextPlacement` adalah tiap objek di kanvas. `ThemePreset` adalah bentuk tema yang dipahami editor/render; paket disk diubah menjadi bentuk ini oleh katalog klien. `Messages` adalah kontrak kamus UI. `HistoryState` berisi daftar komposisi untuk undo/redo.

Jenis ekspor adalah `png` atau `jpeg`; skala adalah 1, 2, atau 3. Kesalahan kamera disederhanakan menjadi kode yang dapat diterjemahkan. Pesan feedback aplikasi adalah `capture`, `upload`, `export`, atau `downloaded`.

### Keamanan dan batas server/browser

Tidak ada otentikasi atau data pengguna pada server. Pemindai tema tetap memvalidasi nama folder, ukuran manifest, isi JSON, warna, font, dan header PNG sebelum mengembalikan paket. Jangan memasukkan data foto ke endpoint tema atau log. Modul katalog tema/stiker membangun data URL menggunakan API browser pada saat modul dimuat; jangan mengimpornya dari kode server. Route scanner memakai modul kontrak yang aman untuk server.

Header keamanan melarang situs lain membungkus aplikasi dalam frame dan membatasi kamera untuk origin sendiri. Kamera membutuhkan izin browser dan OS. Website tidak dapat menjamin semua kamera atau decoder format gambar bekerja sama di setiap perangkat.

## Pengujian dan pemeriksaan

Pengujian otomatis memakai Vitest, jsdom, dan Testing Library. Tes berada di `tests/`. Saat ini tes memeriksa:

- geometri semua template, cropping gambar, pembatasan sticker/teks, undo/redo, tema, reducer sesi dan paritas terjemahan;
- state kamera, kegagalan izin, kesiapan frame, timeout, abort, stream terlambat, cleanup, interupsi dan transformasi mirror;
- validasi folder/manifest/PNG tema, ukuran artwork, diagnostik, URL cache-busting dan fallback preview;
- penggabungan katalog tema dan susunan kartu preview.

Tes yang memakai kamera mengganti `navigator.mediaDevices` dan video dengan objek tiruan. Waktu tunggu memakai fake timers; setelah operasi selesai/batal, timer harus bersih. Tes scanner filesystem memakai folder temporer OS dan membersihkannya; jangan menunjuk test ke folder paket tema nyata karena hasil tes akan bergantung pada isi lokal.

Tes otomatis tidak membuktikan piksel hasil Fabric, kualitas cetak, kamera perangkat nyata, tampilan semua bahasa, atau aksesibilitas dengan screen reader. Pemeriksaan manual yang disarankan:

- Jalankan semua alur kamera, timer, auto-strip, batal dan retake; pastikan foto lama tidak hilang.
- Uji tab disembunyikan saat countdown dan pastikan kamera/pekerjaan berhenti.
- Unggah JPEG/PNG, berkas besar, berkas bukan gambar, dan unggah bertahap.
- Coba semua template, filter, tema, stiker, teks, seleksi, layer, undo/redo.
- Bandingkan pratinjau dengan PNG/JPEG ekspor pada 1× dan 3×; periksa dimensi dan transparansi.
- Uji 360 px, lebar ≤899 px untuk strip tinggi, landscape pendek, serta layar desktop. Pada strip tinggi, scroll vertikal adalah perilaku yang diharapkan.
- Ganti bahasa, mode gelap/terang, reduced motion, navigasi keyboard, fokus, dan label screen reader.
- Uji build standalone, aset statis, logo, font, endpoint tema dan file paket setelah build.

Sebelum menyerahkan perubahan, jalankan:

```bash
npm run verify
```

Gate ini memeriksa format, TypeScript, ESLint tanpa peringatan, seluruh tes, Knip, audit dependency produksi, dan build produksi. Untuk perubahan yang terlihat pengguna, pemeriksaan browser manual tetap diperlukan. Jumlah tes berubah dari waktu ke waktu; lihat output aktual, jangan mengandalkan angka lama.

## Pemecahan masalah

### Kamera tidak menyala

Pastikan halaman dibuka lewat HTTPS atau localhost, izin kamera diberikan di browser dan pengaturan sistem, tidak ada aplikasi lain yang memegang kamera, dan header `Permissions-Policy` tetap mengizinkan `camera=(self)`. Jika stream terbuka tetapi tidak ada frame, tunggu lalu coba kamera fisik lain; kamera virtual atau shutter privasi laptop dapat menghambat frame. Error `denied`, `missing`, `busy`, `unavailable`, `readiness`, dan `capture` menunjukkan jenis kegagalan yang berbeda.

### Kamera tetap menyala setelah keluar

`stopCamera` harus membatalkan pemeriksaan kesiapan, menonaktifkan handler track, menghentikan semua track, menjeda video, dan mengosongkan `srcObject`. `useCamera` juga harus membersihkan listener visibility/pagehide; alur capture membatalkan hitung mundur saat tab tersembunyi. Perubahan lifecycle kamera perlu diuji termasuk stream yang datang terlambat.

### Stiker atau foto tidak terlihat

Periksa console. Gambar foto/stiker yang wajib gagal dimuat membatalkan render; dekorasi tema opsional bisa dilewati. SVG stiker harus mandiri dan memiliki ukuran intrinsik; encoding `btoa` tidak menerima semua karakter Unicode secara langsung. Penempatan di tepi dapat terlihat sebagian keluar walau titik pusat sudah dibatasi.

### Teks bergeser ketika halaman dimuat

Aplikasi menggunakan font Google Sans Flex lokal melalui `next/font/local`, WOFF2 Latin dan lisensi OFL. Pertahankan fallback font yang disesuaikan ukurannya; jangan berpindah kembali ke font Google jarak jauh atau mematikan `adjustFontFallback` tanpa menguji hasil build.

### Peringatan hydration React

Jangan membaca `localStorage`, `window`, `navigator`, atau `matchMedia` ketika render server dan render browser harus menghasilkan HTML awal yang sama. Baca keadaan browser sesudah mount/effect atau gunakan pola mounted yang sesuai. Pemulihan bahasa memang ditunda sampai effect agar HTML awal stabil.

### `useLanguage must be used within a LanguageProvider`

Komponen yang memanggil `useLanguage` harus berada di bawah `LanguageProvider`. Layout root sudah memasangnya; test komponen harus membungkus komponen dengan provider.

### `Incomplete composition`

Pesan ini berarti jumlah foto tidak sama dengan jumlah slot template. Bangun/segarkan draf dari sesi Studio, jangan merakit komposisi parsial secara manual untuk renderer. Renderer sengaja menolak hasil yang tidak lengkap.

### Editor kosong atau berhenti di “Processing…”

Editor perlu dijalankan di browser dan canvas element harus terpasang sebelum Fabric dibuat. Pastikan ukuran `.canvas-wrap` tidak nol; ia perlu menerima tinggi dari stage. Perhatikan console untuk kegagalan foto/stiker wajib atau error render. Tombol coba lagi mengulang render. Saat React StrictMode aktif di pengembangan, effect dapat dijalankan ulang; cleanup canvas harus aman.

### Aset 404 saat menjalankan server standalone

Jalankan `npm run build` setelah perubahan aset/kode lalu `npm start`. Skrip build menyalin `public/` dan `.next/static/` ke standalone. Uji halaman, CSS/JS, WOFF2, `/assets/brand/logo.png`, `/api/themes`, dan artwork. Jika port 3000 dipakai, atur `PORT` ke port lain. Jangan membunuh proses yang tidak dikenal.

### npm audit menampilkan EALLOWSCRIPTS

Pada lingkungan tertentu, konfigurasi user npm `allow-scripts` dapat mengganggu audit. `npm run audit:production` memakai skrip proyek yang mengosongkan konfigurasi itu hanya untuk proses audit anak. Jangan menambahkan workaround global ke konfigurasi proyek tanpa memahami kebijakan npm.

### Knip menandai berkas baru

Knip mencari modul dan ekspor tak terpakai. Hubungkan berkas ke entry point yang benar. Jangan mematikan pemeriksaan atau menambahkan ignore hanya untuk menyembunyikan kode yang memang tidak dipakai.

### Prettier gagal

Jalankan `npm run format`, lalu `npm run format:check`. Markdown juga diformat, termasuk tabel dan pemenggalan baris.

### Preview terlalu kecil, terpotong, atau bisa digulir

`useEditorCanvas` mengukur lebar/tinggi konten `.canvas-wrap` setelah mengurangi padding. Ukuran stage dan rantai flex/grid harus memberi ruang nyata. Biasanya canvas dipasang di kedua sumbu; pada lebar maksimal 899 px untuk strip tinggi, ia sengaja mengikuti lebar dan overflow vertikal dapat digulir. Zoom di atas 100% juga membuat area scroll. Jangan menyebut perilaku scroll strip tinggi di layar sempit sebagai bug sebelum memeriksa aturan ini.

### Paket tema tidak muncul

Buka `http://localhost:3000/api/themes` dan lihat `diagnostics`. Periksa ID folder, lima nama/ukuran PNG yang tepat, `theme.json` valid dan tidak lebih besar dari 16 KB, warna `#rrggbb`, serta ID font yang dikenal. Folder underscore/dot diabaikan. Setelah mengubah folder, muat ulang halaman karena katalog browser diambil saat Studio dipasang.

### Artwork tema lama atau menutupi foto

Pastikan URL artwork API memiliki `?v=<mtime>-<size>` baru dan file yang benar berada di folder yang benar. Standalone melayani salinan `.next/standalone/public/`, bukan folder sumber langsung. Artwork digambar di depan foto; jika slot terlihat tertutup, periksa alpha/transparansi PNG dan sejajarkan area transparan dengan persegi panjang slot. Foto tidak dipotong mengikuti bentuk alpha.

### Kartu tema bentuknya salah

Kartu memakai artwork per-template di atas slot contoh netral. `preview.png` tidak mengubah kartu. Periksa file artwork yang sesuai tata letak, ukuran, response `/api/themes`, dan URL versi cache.

### Teks tidak terbaca di tema gelap

Teks baru mengambil warna dan font tema aktif/fallback. Periksa nilai `textColor` paket dan kontras pada latar/artwork. Jika teks lama dibuat sebelum perilaku tema tertentu berubah, pilih ulang gaya teks atau terapkan tema lagi sesuai kebutuhan.

### Pratinjau sosial atau Open Graph

Halaman menyediakan metadata Open Graph tetapi tidak menjanjikan gambar preview sosial. Jangan menambahkan URL gambar yang belum benar-benar tersedia dalam `public/`; crawler akan menerima 404.

### Pemeriksaan sebelum meminta bantuan

Catat versi `node --version` dan `npm --version`, jalankan `npm run type-check`, `npm run lint`, `npm test`, dan `npm run build`, lalu sertakan browser/OS, URL HTTPS/localhost, pesan console persis, serta apakah masalah hanya muncul di dev atau standalone.

## Hal yang memang belum tersedia

PhotoPip saat ini tidak menyediakan penyimpanan foto permanen, akun, server upload, berbagi tautan, pembayaran, hapus foto tunggal, susun ulang foto, gambar bebas, crop/pan manual di dalam slot, editor rich text per kata, pemilih latar/bingkai terpisah, upload drag-and-drop, atau gestur pinch/pan untuk zoom kanvas. Fitur-fitur ini memerlukan keputusan produk dan bukan perilaku yang boleh diasumsikan sudah ada.

---

## Lisensi font

Font Google Sans Flex yang disertakan memiliki lisensi OFL; berkas lisensinya berada bersama aset font. Pertahankan lisensi saat mengubah atau mendistribusikan ulang font.
