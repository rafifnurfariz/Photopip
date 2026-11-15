import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CameraController } from "@/features/studio/camera/use-camera";
import { useCaptureSession } from "@/features/studio/hooks/use-capture-session";

function controller(): CameraController {
  return {
    status: "ready",
    error: null,
    startCamera: vi.fn().mockResolvedValue(undefined),
    stopCamera: vi.fn(),
    capturePhoto: vi.fn().mockReturnValue(null),
  };
}

function renderSession(camera: CameraController) {
  return renderHook(() =>
    useCaptureSession({ camera, mirror: true, timer: 3, onMessage: () => {} }),
  );
}

afterEach(cleanup);

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
