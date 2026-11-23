// unit test buat validasi file unggahan foto dan stiker di image-upload.ts
// ngecek penolakan file non-gambar dan file yang ukurannya melebihi batas 25MB
import { describe, expect, it } from "vitest";
import {
  isSupportedPhotoFile,
  readPhotoFile,
  readStickerFile,
} from "@/shared-tools/image-upload";

const MB = 1024 * 1024;

// bikin objek File tiruan buat pengujian
function photoFile(name: string, type = "image/png") {
  return new File(["x"], name, { type });
}

// pasang ukuran byte palsu di objek File tanpa bikin buffer gede beneran
function withSize<T extends File>(file: T, size: number): T {
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("readPhotoFile", () => {
  it("rejects a file that is not an image", async () => {
    await expect(
      readPhotoFile(photoFile("notes.txt", "text/plain")),
    ).rejects.toThrow("Unsupported image file");
  });

  it("rejects an oversized file before the browser decodes it", async () => {
    await expect(
      readPhotoFile(withSize(photoFile("huge.png"), 25 * MB + 1)),
    ).rejects.toThrow("Image file is too large");
  });
});

describe("readStickerFile", () => {
  it("rejects a file that is not an image", async () => {
    await expect(
      readStickerFile(photoFile("notes.txt", "text/plain")),
    ).rejects.toThrow("Unsupported image file");
  });

  it("rejects an oversized file before the browser decodes it", async () => {
    await expect(
      readStickerFile(withSize(photoFile("huge.png"), 25 * MB + 1)),
    ).rejects.toThrow("Image file is too large");
  });
});

describe("isSupportedPhotoFile", () => {
  it("accepts an image under the size limit", () => {
    expect(isSupportedPhotoFile(withSize(photoFile("ok.png"), MB))).toBe(true);
  });

  it("rejects an oversized image and a non-image file", () => {
    expect(
      isSupportedPhotoFile(withSize(photoFile("big.png"), 25 * MB + 1)),
    ).toBe(false);
    expect(isSupportedPhotoFile(photoFile("notes.txt", "text/plain"))).toBe(
      false,
    );
  });
});
