import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { ThemePreview } from "@/features/editor/components/theme-preview";
import { templateArtworkSpecs } from "@/shared-tools/catalog/theme-pack";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import type { ThemePreset } from "@/shared-tools/catalog/themes";

afterEach(cleanup);

const artwork = Object.fromEntries(
  templateArtworkSpecs.map((spec) => [
    spec.id,
    `/assets/theme-packs/demo/${spec.file}?v=1-2`,
  ]),
) as Record<TemplateId, string>;

const pack: ThemePreset = {
  id: "demo",
  name: "Demo",
  background: { type: "color", value: "#0b1020", preview: "#0b1020" },
  artwork,
  textColor: "#f8fafc",
  fontId: "display",
};

const builtin: ThemePreset = {
  id: "plain",
  name: "Plain",
  background: { type: "color", value: "#ffffff", preview: "#ffffff" },
  textColor: "#20231f",
  fontId: "app",
};

describe("theme preview", () => {
  it("layers pack artwork above the slot placeholders", () => {
    const template = templates[0];
    const { container } = render(
      <ThemePreview template={template} theme={pack} />,
    );
    const preview = container.querySelector(".theme-preview");
    expect(preview).not.toBeNull();
    expect(preview!.querySelectorAll(".theme-preview-slot")).toHaveLength(
      template.photoCount,
    );
    const image = preview!.querySelector(".theme-preview-artwork");
    expect(image).not.toBeNull();
    expect(image!.getAttribute("src")).toBe(artwork[template.id]);
    expect(preview!.lastElementChild).toBe(image);
    expect(preview!.querySelector(".theme-preview-text")).toBeNull();
  });

  it("keeps built-in cards as slots plus the Aa sample", () => {
    const template = templates[0];
    const { container } = render(
      <ThemePreview template={template} theme={builtin} />,
    );
    const preview = container.querySelector(".theme-preview");
    expect(preview).not.toBeNull();
    expect(preview!.querySelectorAll(".theme-preview-slot")).toHaveLength(
      template.photoCount,
    );
    expect(preview!.querySelector(".theme-preview-artwork")).toBeNull();
    expect(preview!.querySelector(".theme-preview-text")?.textContent).toBe(
      "Aa",
    );
  });
});
