// tipe data satu item stiker yang dipakai dari API /api/stickers sampai panel editor
// nyimpen path gambar, nama tampilan, kata kunci pencarian, sama kategorinya
export interface Sticker {
  id: string;
  name: string;
  src: string;
  tags: string[];
  category?: string;
}
