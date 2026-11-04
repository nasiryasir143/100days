# Video Model Candidate Catalog

Last reviewed: 2026-11-04

This catalog separates a free browser demo from a provider that is actually integrated into the 100days Worker. A model is **GREEN** only after an image-to-video request has completed through our Worker and returned a playable video. A free website, free credits, or a public Space alone is not enough.

## Status key

- **GREEN — integrated and verified:** selectable in the app; a real image-to-video generation has passed through our Worker.
- **YELLOW — candidate:** image-to-video and some free access are evidenced, but the Worker/API path, account-credit rules, or an end-to-end test is still missing.
- **RED — rejected:** not image-to-video, no viable free access, or technically unsuitable.

## Verified green

| Model ID | Model | Free route | Integration status |
|---|---|---|---|
| `wan-2.2-hf` | Wan 2.2 I2V | Existing public Hugging Face Space/shared queue | Existing Worker adapter; current app option. Keep as the fallback. |

## Yellow candidates

| Candidate | I2V evidence | Free access evidence | What remains before green |
|---|---|---|---|
| LTX Video 0.9.8 Distilled | Official Space exposes image upload and an Image-to-Video action | Public Hugging Face Space / shared queue | Inspect current Gradio API schema; test upload, queue, SSE and MP4 through Worker |
| LTX-2.5 | Public official Space/demo accepts an optional image | Hugging Face ZeroGPU public queue; daily quota and queue limits apply | Verify official Space endpoint schema and run end-to-end Worker test |
| Wan 2.1 I2V | Official Wan Space exposes Image-to-Video | Public demo states it is free; shared availability may vary | Inspect API schema and test a real result through Worker |
| FramePack F1 | Hugging Face I2V model and public Spaces are listed | Public Space availability is not a guarantee of a stable free API | Select a maintained Space; verify API and end-to-end generation |
| CogVideoX Online | Website advertises image-to-video | First videos are advertised as free | No supported public API for our Worker confirmed; do not add to app yet |
| PixVerse | Image-to-video product; official docs confirm daily free credits | 30 credits/day for non-members and 60/day for members, according to current help page | Website credits do not establish API entitlement; verify official API access and free-tier terms |
| Pika | I2V modes are listed in official product information | Current pricing page says 0 monthly credits on Free (packs only), while an older FAQ says 150 credits/month; treat free credits as unconfirmed until account-side verification | Verify current free-credit availability and an official API that permits this use |
| Stable Video Diffusion | Model supports image-to-video | Open weights; no reliable hosted free API confirmed | Find a currently running free hosted endpoint and test it |
| HunyuanVideo I2V | Official model supports image-to-video | Open weights; public hosted free inference not established | Find a free hosted endpoint with a callable API; assess compute and limits |
| SkyReels V2 I2V | Hugging Face I2V model listing | No verified free hosted API in this review | Find a public Space with I2V and inspect/test its API |


## Batch 2 — newly discovered public demos (2026-11-04)

These are added to the research catalog, not to the live selector. They remain yellow until the Worker can submit an image, receive the completed result, and return a playable MP4.

| Candidate / endpoint | I2V evidence | Free route | Next verification |
|---|---|---|---|
| LTX-2.5 official Space | Official model documentation supports image-to-video; public Space has an optional starting image | Shared public ZeroGPU queue; anonymous quota is small and may return no-GPU/quota errors | Inspect the official Space's Gradio API and test from Worker |
| LTX-2.5 browser client demo | Browser page sends image/prompt requests to the official Lightricks Space | Public shared queue; page says anonymous users share limited quota | Treat as proof of a browser-accessible route, not a separate model/provider; inspect its request flow/API |
| FramePack F1 public demo | Starting image + motion prompt produces video | Public ZeroGPU demo; shared quota and queue, sign-in may be required | Identify the underlying Space and verify its Gradio endpoint |
| Wan 2.2 14B Fast public Space | Space directory describes animation from a single image and prompt | Public ZeroGPU queue | Inspect Space API and compare with the existing Wan 2.2 adapter before adding as a separate option |
| Wan 2.2 14B Preview public Space | Space directory describes image + text prompt video generation | Public ZeroGPU queue | Inspect API and determine whether it is a distinct backend or duplicate of the current Wan 2.2 family |
| LTX-2.3 community demo | Space card describes image-to-video with a conditioning image | Public Space page exists, but its notes say it needs A100 80GB/H100-class hardware; no dependable free GPU claim | Do not treat as free until live hardware/quota is verified |
| LTX-2.3 / LTX-2.5 workflows on wan2.video | Curated pages link to public LTX image-to-video workflows | Shared HF ZeroGPU capacity | Demo directory only, not independent model backends; verify each underlying Space once |
| NOVA public LTX generator | Page describes image upload + prompt and an unauthenticated Gradio queue endpoint | Claims no provider token/payment setup; shared free queue can be rate-limited or unavailable | Verify actual endpoint, API schema, and whether it is the official LTX Space before integration |

### Batch 2 assessment

- New green models: 0. None has yet passed a real request through our 100days Worker.
- New yellow demo routes: LTX-2.5 official Space, FramePack F1 demo, Wan 2.2 Fast/Preview Spaces, LTX-2.3 community demo, and the NOVA LTX wrapper.
- Do not count multiple frontends for the same underlying model as separate models. Track both model family and endpoint so duplicate demos do not inflate the count.
- LTX-2.5's official API is documented as a paid API with per-second billing. That is not the same as the shared free public Space; do not use the paid API unless separately approved.

## Important implementation rules

1. Do not put yellow candidates in the live model selector. Only green adapters belong there.
2. Keep each provider in its own adapter behind the existing `POST /generate` route.
3. Preserve `POST /generate-image` and the current image-generation implementation unchanged.
4. Keep the current Wan 2.2 adapter as fallback.
5. A provider that requires a user account or token must use a Worker secret; never put provider tokens in browser code or commit them.
6. A website's free credits are tied to that website/account and cannot be assumed to be transferable to our app's API.
7. Public community GPU queues can be paused, rate-limited, or unavailable. Do not promise uninterrupted or unlimited free generation.
8. Promote a candidate from yellow to green only after a real image upload, job submission, completed SSE/result retrieval, and playable video have all been tested through the Worker.

## Sources checked

- Hugging Face ZeroGPU quotas and free public Space access: https://huggingface.co/docs/hub/spaces-zerogpu
- Hugging Face Spaces as API endpoints and queue/SSE API: https://github.com/huggingface/hub-docs/blob/main/docs/hub/spaces-api-endpoints.md
- LTX Video official model card and I2V demo links: https://huggingface.co/Lightricks/LTX-Video
- LTX Video 0.9.8 public I2V Space: https://lightricks-ltx-video-distilled.hf.space/
- LTX-2.5 public demo: https://huggingface.co/spaces/Lightricks/LTX-2.5
- Wan 2.1 public I2V Space: https://wan-ai-wan2-1.hf.space/
- Hugging Face I2V model/Space directory: https://huggingface.co/tasks/image-to-video
- CogVideo Online: https://cogvideo.net/online
- PixVerse official free-credit FAQ: https://docs.pixverse.ai/FAQ-PixVerse-App-1533e99bf35080888cb5effee85f8289
- Pika official pricing: https://pika.art/pricing


## Batch 3 — test-first board (2026-11-04)

The user approved a test-first workflow: test the candidates before adding them to the live app selector. Keep this board as the source of truth; do not expose unverified candidates as selectable models.

### Test queue

| Order | Candidate | Current status | Evidence / blocker | Test decision |
|---|---|---|---|---|
| 1 | LTX-2.5 official Hugging Face Space | YELLOW — API shape partly inspected; Worker test not run | Official Space source shows an optional input image, prompt, dimensions, duration, seed, decoder, auto-length, random-seed and prompt-enhancement inputs. Its Gradio handler returns video plus metadata. Public ZeroGPU availability is shared and quota-limited. | First candidate for a controlled adapter proof-of-concept. Before coding, confirm the live Gradio API endpoint/schema and upload protocol; then test through the Worker. |
| 2 | LTX Video 0.9.8 Distilled | YELLOW — not tested | Public I2V Space exists; live API schema and upload/result flow still need inspection. | Next after LTX-2.5, or sooner if its API is simpler and accessible. |
| 3 | FramePack F1 public demo | YELLOW — not tested | Public demo supports starting image + prompt; stable endpoint/API and queue access not confirmed. | Inspect exact Space and API, then test. |
| 4 | Wan 2.2 14B Fast public Space | YELLOW — not tested | Possible separate Space/backend, but may duplicate the current Wan 2.2 family. | Compare endpoint and model identity before creating another selector entry. |
| 5 | Wan 2.2 14B Preview public Space | YELLOW — not tested | Possible duplicate of current Wan 2.2 adapter; live API not inspected. | Compare with existing adapter; do not add a duplicate without a meaningful difference. |
| 6 | Wan 2.1 I2V | YELLOW — not tested | Public I2V demo identified; live API schema and Worker compatibility unknown. | Inspect and test. |
| 7 | NOVA LTX wrapper | YELLOW — not tested | Claims an unauthenticated Gradio queue, but actual endpoint and underlying model identity need verification. | Lower priority; avoid counting it as a distinct model. |
| 8 | LTX-2.3 community demo | YELLOW — not tested | Public Space identified, but high-end GPU requirement makes free shared availability uncertain. | Test only if Space is currently running and accessible. |

### Test gate — required for GREEN

A candidate is promoted only when all of these pass:

1. Confirm the exact upstream Space/API and its current public access conditions.
2. Upload a test image through the 100days Worker (not just through the provider's website).
3. Submit a prompt and receive a job/queue response.
4. Receive the completed result through the existing Worker response/SSE flow.
5. Confirm the returned MP4 is playable in the existing app preview and downloadable.
6. Confirm errors/timeouts do not break Wan 2.2 or the separate `/generate-image` route.
7. Record actual duration, queue outcome, free-access limitation, and date tested.

A public demo page or successful provider-side browser test alone is not a GREEN result. If the public Space is temporarily busy, record YELLOW / blocked and retry later; do not label the model broken based on one transient queue failure.

### First technical inspection — LTX-2.5

The official Space's published `app.py` shows that image-to-video is selected by supplying an image path; the same handler also accepts prompt, height, width, duration, seed, decoder, auto-length, randomization and prompt-enhancement controls. It returns a video file plus prompt/seed/length metadata. This confirms the Space's I2V design, but does **not** yet confirm the current live Gradio API endpoint name, file-upload contract, public queue availability, or Worker compatibility. Therefore it remains YELLOW.

Source: https://huggingface.co/spaces/Lightricks/LTX-2.5/blob/main/app.py
