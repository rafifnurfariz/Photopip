// daftar 5 template tata letak foto bawaan PhotoPip (strip 4, strip 3, grid 2x3, 2x2, single)
// ukuran cetak, rasio, dan jumlah foto di sini jadi acuan studio, editor, sama paket bingkai
const definitions = [
  // strip klasik isi 4 foto vertikal ukuran 2x6 inci
  {
    id: "4x1",
    name: "Classic Strip",
    size: '2" × 6"',
    aspectRatio: 1 / 3,
    photoCount: 4,
    layout: "vertical",
  },
  // strip lebih pendek isi 3 foto vertikal
  {
    id: "3x1",
    name: "Triple Strip",
    size: '2" × 4.5"',
    aspectRatio: 1 / 2.25,
    photoCount: 3,
    layout: "vertical",
  },
  // grid 2 kolom x 3 baris buat 6 foto sekaligus
  {
    id: "2x3",
    name: "2x3 Grid",
    size: '4" × 6"',
    aspectRatio: 2 / 3,
    photoCount: 6,
    layout: "grid",
  },
  // grid kotak persegi isi 4 foto
  {
    id: "2x2",
    name: "Square Grid",
    size: '4" × 4"',
    aspectRatio: 1,
    photoCount: 4,
    layout: "grid",
  },
  // satu foto besar ukuran 4x6 inci
  {
    id: "1x1",
    name: "Single Photo",
    size: '4" × 6"',
    aspectRatio: 2 / 3,
    photoCount: 1,
    layout: "single",
  },
] as const;

export type Template = (typeof definitions)[number];
export type TemplateId = Template["id"];

export const templates: readonly Template[] = definitions;

// cari data template dari id-nya, balik ke 4x1 kalau gak ketemu
export function findTemplate(id: TemplateId): Template {
  return definitions.find((template) => template.id === id) ?? definitions[0];
}
