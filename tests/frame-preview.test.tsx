import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { FramePreview } from "@/features/editor/components/frame-preview";
import { templateArtworkSpecs } from "@/shared-tools/catalog/frame-pack";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import type { FramePreset } from "@/shared-tools/catalog/frames";

afterEach(cleanup);

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
