# Video Model Test List

Last reviewed: 2026-11-04

This is a deliberately short list. Models with unclear access, uncertain free usage, duplicate endpoints, or no usable image-to-video route have been removed from the active test queue.

## Confirmed in the 100days app

| Model ID | Model | Current status |
|---|---|---|
| `wan-2.2-hf` | Wan 2.2 Image-to-Video | GREEN — existing Worker adapter and current website option. Keep as the working fallback. |

## Keep for the next website test

| Candidate | Why it stays | What is still unverified |
|---|---|---|
| LTX Video 0.9.8 13B Distilled | The live public Gradio Space visibly exposes an input image, prompt, an Image-to-Video generate action, and a generated-video output. The official Lightricks model card confirms image-to-video support. | The Space's live API schema, upload/return format, shared queue availability, and a complete generation through our own Worker have not yet been tested. |

Candidate Space: https://lightricks-ltx-video-distilled.hf.space/

Official model information: https://huggingface.co/Lightricks/LTX-Video

## Removed from the active test list

The following were removed because the route is paid, duplicate, not verified as a callable free endpoint, or has too many unresolved access/API questions. They can be researched again later only if a concrete working endpoint is found.

- LTX-2.5 — public demo/API path and quota conditions not sufficiently verified for our Worker.
- Wan 2.1 I2V — endpoint/API and current public access not tested.
- FramePack F1 — exact stable Space/API and access not verified.
- CogVideoX Online — website access does not establish a usable Worker API.
- PixVerse — website free credits do not establish free API access.
- Pika — free-credit information conflicts and an appropriate free API is unconfirmed.
- Stable Video Diffusion — no reliable free hosted endpoint confirmed.
- HunyuanVideo I2V — no reliable free hosted endpoint confirmed.
- SkyReels V2 I2V — no reliable free hosted endpoint confirmed.
- Wan 2.2 Fast/Preview — possible duplicate routes; no proven advantage over the current Wan 2.2 adapter.
- LTX-2.3 community demo — dependable free GPU access not established.
- LTX browser clients, workflow directories, and NOVA wrapper — not counted as independent models; underlying endpoint/API not sufficiently verified.

## Test gate

LTX Video 0.9.8 remains a candidate, not a working website option, until all checks pass:

1. Confirm the exact Gradio API endpoint and input schema.
2. Upload a test image through the 100days Worker.
3. Submit a prompt and receive a job ID.
4. Receive the completed result through the Worker stream.
5. Play and download the MP4 in the 100days website.
6. Confirm the existing Wan 2.2 and separate `/generate-image` route still work.

Only then promote it to GREEN and add it to the live model selector.

## Safety / reliability rules

- Keep the current Wan 2.2 route as fallback.
- Do not change the separate `/generate-image` route while adding a video provider.
- Keep any new provider in its own adapter and configure its endpoint separately.
- Do not put provider secrets in browser code or commit them.
- A public demo may have a shared queue, rate limits, or temporary outages. Do not promise unlimited free use.
- Never mark a model GREEN based only on its demo page or model card.

## Sources checked

- LTX Video 0.9.8 live public Gradio Space: https://lightricks-ltx-video-distilled.hf.space/
- Official Lightricks LTX-Video model card: https://huggingface.co/Lightricks/LTX-Video
- Hugging Face Spaces API documentation: https://huggingface.co/docs/hub/spaces-api-endpoints
