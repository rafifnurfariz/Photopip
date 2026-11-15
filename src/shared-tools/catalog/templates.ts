const definitions = [
  {
    id: "4x1",
    name: "Classic Strip",
    size: '2" × 6"',
    aspectRatio: 1 / 3,
    photoCount: 4,
    layout: "vertical",
  },
  {
    id: "3x1",
    name: "Triple Strip",
    size: '2" × 4.5"',
    aspectRatio: 1 / 2.25,
    photoCount: 3,
    layout: "vertical",
  },
  {
    id: "2x3",
    name: "2x3 Grid",
    size: '4" × 6"',
    aspectRatio: 2 / 3,
    photoCount: 6,
    layout: "grid",
  },
  {
    id: "2x2",
    name: "Square Grid",
    size: '4" × 4"',
    aspectRatio: 1,
    photoCount: 4,
    layout: "grid",
  },
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

export function findTemplate(id: TemplateId): Template {
  return definitions.find((template) => template.id === id) ?? definitions[0];
}
