# TACEDGE · Fulton Hogan

Working repository for the TACEDGE engagement with Fulton Hogan under NZTA's
Integrated Delivery Model (IDM).

## Contents

| Path | What it is | Status |
| --- | --- | --- |
| `meeting-prep/2026-07-30-fulton-hogan-cheat-sheet.html` | Dan's one-page reference for the 30 July 2026 meeting with Amanda Lawrey: acronym glossary, background on FH's digital programme, positioning anchors, questions to ask, and what not to say. | internal |
| `assets/logo/` | Approved TACEDGE lockup, copied unmodified from the brand repository. | approved |
| `assets/fonts/` | Self-hosted woff2 files that render the documents here. Not a font library. | see `assets/fonts/README.md` |

Open the cheat sheet directly in a browser, or print it (the layout is set up
for single-sided A4).

## Read this before adding anything

**This repository is public.** Everything committed here is readable by
anyone, including Fulton Hogan. The cheat sheet is prep material, not
customer collateral: it names people, characterises how a client will react,
records what to avoid saying, and quotes internal pricing. None of it has
been agreed with Fulton Hogan.

The sheet is also published to
<https://tacedge.github.io/Fulton-Hogan/>, served unlisted — `robots.txt`
and a `noindex` directive keep it out of search results, and nothing links to
it. That is obscurity, not access control.

If any of this should not be public, the fix is to make the repository
private, not to delete the file. Git history keeps what was pushed.

## Brand

Everything in this repository follows
[TacEdge/Brand-Identity-and-Guidelines](https://github.com/TacEdge/Brand-Identity-and-Guidelines),
which is the source of truth. In practice that means:

- TACEDGE is always uppercase in written use.
- Colour comes from `tokens/colors.json` in the brand repository. No new
  colours. The primary dark green is `#112411`; `#2B4721` is an artwork-only
  colour inside logo files and must not be used as a surface or text colour.
- Type is Be Vietnam Pro (body and interface), JetBrains Mono (utility labels,
  used sparingly) and Play (display). Fonts are self-hosted, never loaded from
  a CDN.
- Ochre `#B07D2B` and brick `#9E3B2E` are status colours, never decorative.
  Brick marks prohibition in do/don't material, matching the brand site.
- Logo assets are used as supplied. They are never redrawn, recoloured or
  rebuilt with text and CSS.
- NZ spelling. No em dashes in new copy.

If a brand value here ever disagrees with the brand repository, the brand
repository wins and this repository is the thing that gets corrected.

## Claims discipline

TACEDGE is in production on anchoring and drilling in New Zealand and Samoa.
Claim nothing beyond that. Do not describe Maximo, ArcGIS or M-Field
integrations as built. Do not present pricing as agreed.
