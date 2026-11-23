// unit test buat komponen FramePreview di tab Bingkai editor
// ngecek urutan tumpukan gambar artwork PNG di atas slot sama fallback teks "Aa" buat bingkai polos
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { FramePreview } from "@/features/editor/components/frame-preview";
import { templateArtworkSpecs } from "@/shared-tools/catalog/frame-pack";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import type { FramePreset } from "@/shared-tools/catalog/frames";

afterEach(cleanup);

// contoh peta URL artwork buat paket bingkai uji
const artwork = Object.fromEntries(
  templateArtworkSpecs.map((spec) => [
    spec.id,
    `/assets/frame-packs/demo/${spec.file}?v=1-2`,
  ]),
) as Record<TemplateId, string>;

const pack: FramePreset = {
  id: "demo",
  name: "Demo",
  background: { type: "color", value: "#0b1020", preview: "#0b1020" },
  artwork,
  textColor: "#f8fafc",
  fontId: "display",
};

const builtin: FramePreset = {
  id: "plain",
  name: "Plain",
  background: { type: "color", value: "#ffffff", preview: "#ffffff" },
  textColor: "#20231f",
  fontId: "app",
};

describe("frame preview", () => {
  // cek gambar PNG bingkai dirender paling akhir biar nutup di atas slot foto
  it("layers pack artwork above the slot placeholders", () => {
    const template = templates[0];
    const { container } = render(
      <FramePreview template={template} frame={pack} />,
    );
    const preview = container.querySelector(".frame-preview");
    expect(preview).not.toBeNull();
    expect(preview!.querySelectorAll(".frame-preview-slot")).toHaveLength(
      template.photoCount,
    );
    const image = preview!.querySelector(".frame-preview-artwork");
    expect(image).not.toBeNull();
    expect(image!.getAttribute("src")).toBe(artwork[template.id]);
    expect(preview!.lastElementChild).toBe(image);
    expect(preview!.querySelector(".frame-preview-text")).toBeNull();
  });

  // cek bingkai polos nampilin slot ditambah tulisan sampel "Aa" tanpa elemen <img>
  it("keeps built-in cards as slots plus the Aa sample", () => {
    const template = templates[0];
    const { container } = render(
      <FramePreview template={template} frame={builtin} />,
    );
    const preview = container.querySelector(".frame-preview");
    expect(preview).not.toBeNull();
    expect(preview!.querySelectorAll(".frame-preview-slot")).toHaveLength(
      template.photoCount,
    );
    expect(preview!.querySelector(".frame-preview-artwork")).toBeNull();
    expect(preview!.querySelector(".frame-preview-text")?.textContent).toBe(
      "Aa",
    );
  });
});
