/**
 * LTX Video 0.9.8 Distilled Gradio adapter.
 * Isolated from the Wan adapter and image-generation route.
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
  "worst quality, inconsistent motion, blurry, jittery, distorted";

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
    const detail = await uploaded.text().catch(() => "");
    throw new Error(`LTX image upload failed (${uploaded.status})${detail ? `: ${detail.slice(0, 200)}` : ""}. The public Space may be busy or sleeping.`);
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

  // Exact input order from the live Space i2v_inputs:
  // prompt, negative_prompt, input_image, input_video, height, width,
  // mode, duration, frames_to_use, seed, randomize_seed, guidance_scale,
  // improve_texture.
  // The former adapter sent a removed steps field and omitted mode args.
  const data = [
    params.prompt?.trim() || "Bring this image to life with natural cinematic motion.",
    NEGATIVE_PROMPT,
    fileData,
    null,
    512,
    704,
    "image-to-video",
    clamp(params.duration_seconds ?? 3, 0.3, 8.5),
    9,
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
    const detail = await submitted.text().catch(() => "");
    throw new Error(`LTX job submission failed (${submitted.status})${detail ? `: ${detail.slice(0, 300)}` : ""}.`);
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
    const detail = await stream.text().catch(() => "");
    throw new Error(`Could not open LTX result stream (${stream.status})${detail ? `: ${detail.slice(0, 200)}` : ""}.`);
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
