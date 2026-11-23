import { describe, expect, it } from "vitest";
import { messages } from "@/translations";
import { delay } from "@/shared-tools/async";
import { templates } from "@/shared-tools/catalog/templates";
import {
  activeFrame,
  applyFrame,
  framePresets,
  type FramePreset,
} from "@/shared-tools/catalog/frames";
import {
  coverCrop,
  fitCanvas,
  normalizeSticker,
  templateGeometry,
} from "@/shared-tools/composition/geometry";
import { normalizeText } from "@/shared-tools/composition/text";
import type { Composition } from "@/shared-tools/composition/types";
import {
  initialHistory,
  pushHistory,
  redoHistory,
  undoHistory,
} from "@/features/editor/history";
import { initialSession, sessionReducer } from "@/shared-tools/session";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, shape(child)]),
    );
  }
  return typeof value;
}

const emptyComposition: Composition = {
  template: templates[0],
  photos: [],
  frameId: "plain",
  stickers: [],
  texts: [],
  photoFilters: [],
};

describe("composition and capture state", () => {
  it.each(templates)(
    "keeps $id print size and all slots inside the canvas",
    (template) => {
      const result = templateGeometry(template);
      expect(result.width / result.height).toBeCloseTo(template.aspectRatio, 3);
      expect(result.slots).toHaveLength(template.photoCount);
      for (const slot of result.slots) {
        expect(slot.x).toBeGreaterThan(0);
        expect(slot.y).toBeGreaterThan(0);
        expect(slot.x + slot.width).toBeLessThan(result.width);
        expect(slot.y + slot.height).toBeLessThan(
          result.height - result.footer,
        );
      }
    },
  );
  it("center crops wide and tall sources without stretching them", () => {
    const slot = { x: 0, y: 0, width: 200, height: 100 };
    expect(coverCrop(800, 200, slot)).toEqual({
      scale: 0.5,
      cropX: 200,
      cropY: 0,
      width: 400,
      height: 200,
    });
    expect(coverCrop(200, 800, slot)).toEqual({
      scale: 1,
      cropX: 0,
      cropY: 350,
      width: 200,
      height: 100,
    });
  });
  it("bounds transformed stickers and normalizes rotation", () => {
    expect(
      normalizeSticker(
        { x: -5, y: 2000, size: 5000, rotation: -15 },
        600,
        1800,
      ),
    ).toEqual({ x: 0, y: 1800, size: 600, rotation: 345 });
  });
  it("fits the display canvas inside both measured axes without upscaling", () => {
    const geometry = { width: 600, height: 1800 };
    expect(fitCanvas(geometry, 300, 1000)).toEqual({ width: 300, height: 900 });
    expect(fitCanvas(geometry, 600, 300)).toEqual({ width: 100, height: 300 });
    expect(fitCanvas(geometry, 1000, 4000)).toEqual({
      width: 600,
      height: 1800,
    });
    expect(fitCanvas(geometry, 0, 300)).toEqual({ width: 0, height: 0 });
    expect(fitCanvas(geometry, 300, 0)).toEqual({ width: 0, height: 0 });
  });
  it("bounds text placements and clamps their length and style values", () => {
    const result = normalizeText(
      {
        id: "caption",
        text: "x".repeat(200),
        x: -10,
        y: 9999,
        size: 2,
        rotation: -90,
        color: "#000000",
        fontId: "app",
        align: "center",
        bold: false,
        italic: false,
        opacity: 2,
      },
      600,
      1800,
    );
    expect(result.text).toHaveLength(120);
    expect(result.x).toBe(0);
    expect(result.y).toBe(1800);
    expect(result.size).toBe(18);
    expect(result.rotation).toBe(270);
    expect(result.opacity).toBe(1);
  });
  it("undoes and redoes composition snapshots in order", () => {
    const first = { ...emptyComposition, frameId: "plain" };
    const second = { ...emptyComposition, frameId: "noir" };
    const third = { ...emptyComposition, frameId: "candy" };
    let history = pushHistory(initialHistory, first);
    history = pushHistory(history, second);
    const undone = undoHistory(history, third);
    expect(undone?.next.frameId).toBe("noir");
    const redone = undone ? redoHistory(undone.state, second) : null;
    expect(redone?.next.frameId).toBe("candy");
  });
  it("applies a frame to the strip and existing captions", () => {
    const frame: FramePreset = {
      id: "classic",
      name: "Classic",
      background: { type: "color", value: "#ffffff", preview: "#ffffff" },
      textColor: "#20231f",
      fontId: "serif",
    };
    const result = applyFrame(
      {
        ...emptyComposition,
        texts: [
          {
            id: "caption",
            text: "Hello",
            x: 300,
            y: 900,
            size: 32,
            rotation: 0,
            color: "#000000",
            fontId: "app",
            align: "center",
            bold: false,
            italic: false,
            opacity: 1,
          },
        ],
      },
      frame,
    );
    expect(result.frameId).toBe(frame.id);
    expect(result.texts[0].color).toBe(frame.textColor);
    expect(result.texts[0].fontId).toBe(frame.fontId);
  });
  it("keeps frame ids unique and every background well formed", () => {
    expect(framePresets).toHaveLength(0);
    expect(new Set(framePresets.map((frame) => frame.id)).size).toBe(
      framePresets.length,
    );
  });
  it("only marks a preset active while frame and caption style match", () => {
    const frame: FramePreset = {
      id: "plain",
      name: "Plain",
      background: { type: "color", value: "#ffffff", preview: "#ffffff" },
      textColor: "#20231f",
      fontId: "app",
    };
    const applied = applyFrame(emptyComposition, frame);
    expect(activeFrame(applied, [frame])?.id).toBe(frame.id);
    expect(activeFrame({ ...applied, frameId: "missing" }, [frame])).toBeNull();
    const captioned = {
      ...applied,
      texts: [
        {
          id: "caption",
          text: "Hello",
          x: 300,
          y: 900,
          size: 32,
          rotation: 0,
          color: frame.textColor,
          fontId: frame.fontId,
          align: "center" as const,
          bold: false,
          italic: false,
          opacity: 1,
        },
      ],
    };
    expect(activeFrame(captioned, [frame])?.id).toBe(frame.id);
    expect(
      activeFrame(
        {
          ...captioned,
          texts: [{ ...captioned.texts[0], color: "#123456" }],
        },
        [frame],
      ),
    ).toBeNull();
  });
  it("prevents more photos than slots and replaces exactly the retaken photo", () => {
    let state = initialSession;
    for (const src of ["a", "b", "c", "d", "duplicate"])
      state = sessionReducer(state, { type: "capture", src, count: 4 });
    expect(state.photos).toEqual(["a", "b", "c", "d"]);
    state = sessionReducer(state, { type: "retake", index: 1 });
    state = sessionReducer(state, {
      type: "capture",
      src: "replacement",
      count: 4,
    });
    expect(state.photos).toEqual(["a", "replacement", "c", "d"]);
    expect(state.retakeIndex).toBeNull();
  });
  it("reset drops pending retake identity and changes layout", () => {
    expect(
      sessionReducer(
        { ...initialSession, photos: ["a"], retakeIndex: 0 },
        { type: "reset", templateId: "2x3" },
      ),
    ).toEqual({ templateId: "2x3", photos: [], retakeIndex: null });
  });
  it("cancels a countdown before capture", async () => {
    const controller = new AbortController();
    const promise = delay(10000, controller.signal);
    controller.abort();
    await expect(promise).rejects.toThrow("Cancelled");
  });
  it("has the same message shape and layout names in every language", () => {
    const reference = shape(messages.en);
    for (const value of Object.values(messages)) {
      expect(shape(value)).toEqual(reference);
      expect(Object.keys(value.layoutNames).sort()).toEqual(
        templates.map((template) => template.id).sort(),
      );
    }
  });
});
