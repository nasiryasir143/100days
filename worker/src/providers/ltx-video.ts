/**
 * LTX Video Distilled Gradio adapter.
 *
 * Kept separate from the existing Wan 2.2 adapter so either provider can be
 * changed without touching the image-generation endpoint.
 */
export interface LtxEnv {
  readonly LTX_SPACE_BASE?: string;
}

export interface LtxParams {
  prompt?: string;
  duration_seconds?: number;
  steps?: number;
}

const NEGATIVE_PROMPT =
  "worst quality, inconsistent motion, blurry, jittery, distorted, text, watermark";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export async function generateWithLtx(
  image: File,
  params: LtxParams,
  env: LtxEnv,
): Promise<Response> {
  const base = (env.LTX_SPACE_BASE || "https://lightricks-ltx-video-distilled.hf.space")
    .replace(/\/$/, "");

  const upload = new FormData();
  upload.append("files", image, image.name || "input.png");
  const uploaded = await fetch(`${base}/gradio_api/upload`, {
    method: "POST",
    body: upload,
  });
  if (!uploaded.ok) {
    throw new Error(`LTX image upload failed (${uploaded.status}); the public Space may be busy or sleeping.`);
  }
  const paths = (await uploaded.json()) as unknown;
  if (!Array.isArray(paths) || typeof paths[0] !== "string") {
    throw new Error("LTX upload returned an unexpected file reference.");
  }

  const imagePath = paths[0];
  const fileData = {
    path: imagePath,
    url: `${base}/gradio_api/file=${imagePath}`,
    orig_name: image.name || "input.png",
    size: image.size,
    mime_type: image.type || "image/png",
    meta: { _type: "gradio.FileData" },
  };

  // Matches the public Space's image_to_video input order in app.py:
  // prompt, negative prompt, image, empty video, height, width, mode,
  // steps, duration, frames-to-use, seed, randomize, CFG, improve texture.
  const data = [
    params.prompt?.trim() || "Bring this image to life with natural cinematic motion.",
    NEGATIVE_PROMPT,
    fileData,
    null,
    512,
    896,
    "image-to-video",
    clamp(Math.round(params.steps ?? 6), 1, 30),
    clamp(params.duration_seconds ?? 4.5, 0.3, 4.5),
    0,
    42,
    true,
    3.0,
    false,
  ];

  const submitted = await fetch(`${base}/gradio_api/call/image_to_video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!submitted.ok) {
    throw new Error(`LTX job submission failed (${submitted.status}).`);
  }
  const body = (await submitted.json()) as { event_id?: string };
  if (!body.event_id) {
    throw new Error("LTX did not return a generation event ID.");
  }

  const stream = await fetch(
    `${base}/gradio_api/call/image_to_video/${body.event_id}`,
    { method: "GET", headers: { Accept: "text/event-stream" } },
  );
  if (!stream.ok || !stream.body) {
    throw new Error(`Could not open LTX result stream (${stream.status}).`);
  }

  return new Response(stream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
