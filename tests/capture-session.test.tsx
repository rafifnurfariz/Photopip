import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CameraController } from "@/features/studio/camera/use-camera";
import { useCaptureSession } from "@/features/studio/hooks/use-capture-session";
import {
  isSupportedPhotoFile,
  readPhotoFile,
} from "@/shared-tools/image-upload";

vi.mock("@/shared-tools/image-upload", () => ({
  isSupportedPhotoFile: vi.fn(),
  readPhotoFile: vi.fn(),
}));

function controller(): CameraController {
  return {
    status: "ready",
    error: null,
    startCamera: vi.fn().mockResolvedValue(undefined),
    stopCamera: vi.fn(),
    capturePhoto: vi.fn().mockReturnValue(null),
  };
}

function renderSession(camera: CameraController, onMessage = () => {}) {
  return renderHook(() =>
    useCaptureSession({ camera, mirror: true, timer: 3, onMessage }),
  );
}

function photoFile(name: string) {
  return new File(["x"], name, { type: "image/png" });
}

beforeEach(() => {
  vi.mocked(isSupportedPhotoFile).mockReturnValue(true);
});

afterEach(() => {
  cleanup();
  vi.mocked(readPhotoFile).mockReset();
  vi.mocked(isSupportedPhotoFile).mockReset();
});

describe("capture session camera ownership", () => {
  it("keeps a running camera alive when the layout changes", () => {
    const camera = controller();
    const { result } = renderSession(camera);
    act(() => result.current.resetSession("2x3"));
    expect(camera.stopCamera).not.toHaveBeenCalled();
    expect(result.current.template.id).toBe("2x3");
  });
  it("still stops the camera before a retake", () => {
    const camera = controller();
    const { result } = renderSession(camera);
    act(() => result.current.retake(0));
    expect(camera.stopCamera).toHaveBeenCalledTimes(1);
  });
});

describe("upload batches", () => {
  it("inserts every photo only after the whole batch decoded", async () => {
    vi.mocked(readPhotoFile)
      .mockResolvedValueOnce("data:image/jpeg;base64,one")
      .mockResolvedValueOnce("data:image/jpeg;base64,two");
    const { result } = renderSession(controller());

    await act(async () => {
      await result.current.uploadPhotos([
        photoFile("a.png"),
        photoFile("b.png"),
      ]);
    });

    expect(result.current.session.photos).toEqual([
      "data:image/jpeg;base64,one",
      "data:image/jpeg;base64,two",
    ]);
  });

  it("adds nothing when one file in the batch fails to decode", async () => {
    vi.mocked(readPhotoFile)
      .mockResolvedValueOnce("data:image/jpeg;base64,one")
      .mockRejectedValueOnce(new Error("decode failed"));
    const onMessage = vi.fn();
    const { result } = renderSession(controller(), onMessage);

    await act(async () => {
      await result.current.uploadPhotos([
        photoFile("a.png"),
        photoFile("b.png"),
      ]);
    });

    expect(result.current.session.photos).toEqual([]);
    expect(onMessage).toHaveBeenCalledWith("upload");
  });

  it("rejects the batch before decoding when a file is unsupported", async () => {
    vi.mocked(isSupportedPhotoFile)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const onMessage = vi.fn();
    const { result } = renderSession(controller(), onMessage);

    await act(async () => {
      await result.current.uploadPhotos([
        photoFile("a.png"),
        photoFile("b.txt"),
      ]);
    });

    expect(result.current.session.photos).toEqual([]);
    expect(readPhotoFile).not.toHaveBeenCalled();
    expect(onMessage).toHaveBeenCalledWith("upload");
  });
});
