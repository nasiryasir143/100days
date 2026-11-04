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
