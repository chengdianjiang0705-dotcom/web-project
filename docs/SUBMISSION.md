# Course submission / 课程提交材料

## Five text fields

**Title (3 words)**

Outfit Color Lab

**One sentence (14 words)**

A simple color tool that helps students plan outfits using clothes they already own.

**Description (4 paragraphs)**

Outfit Color Lab is an interactive website for exploring everyday clothing colors. Visitors can change the colors of a top, trousers and shoes independently, compare combinations and start again. Its purpose is to make outfit planning approachable through quick visual experiments.

The website is designed for university students who are unsure how to combine clothes they already own. It focuses on color rather than brands, shopping, sizing or body shape. All examples are starting points for personal exploration, rather than claims about a universally correct outfit.

The four main pages have distinct roles. Home introduces the website and its three-step process. Color Guide explains neutral combinations, tonal dressing and an accent color. Color Lab provides the interactive tool. Outfit Gallery contains six editable presets with category filters. A supplementary project page records the planning process.

The implementation uses semantic HTML, responsive CSS and JavaScript modules. A JavaScript object holds the three garment colors, and the interface updates original SVG illustrations, labels and selected swatches together. URL parameters load and share palettes. The site needs no account or database, credits its external photographs and includes course-size icons and a share cover.

**Public HTTPS website**

https://chengdianjiang0705-dotcom.github.io/web-project/

**Public source repository**

https://github.com/chengdianjiang0705-dotcom/web-project

## Four images to upload

| Required image | Repository path | Specification |
| --- | --- | --- |
| Open Graph cover | `images/og-image.jpg` | 1200 × 630 JPEG, below 100 KB |
| Favicon | `favicon-32.png` | 32 × 32 PNG |
| Desktop screenshot | `docs/screenshots/desktop-home.png` | 1440 px wide, no browser bars |
| Phone screenshot | `docs/screenshots/mobile-home.png` | 390 px wide, no browser bars |

Additional lab, guide and gallery screenshots are in `docs/screenshots/`. `apple-touch-icon.png` is 180 × 180 and is linked on every page. `icon-512.png` preserves the original square design.

## Process evidence and limits

- Planning and five project ideas: `project.html`.
- Actual development decisions: `docs/PROCESS.md`.
- Original artwork: `outfit.js`, `favicon.svg`, `scripts/make_assets.py` and `scripts/make-cover.mjs`.
- Attributions: `docs/SOURCES.md` and every page's footer.
- Tests and device widths: `docs/TESTING.md`, `tests/outfit.test.mjs` and `scripts/browser-qa.mjs`.
- Actual commit sequence: the GitHub repository's commit history.
- Development in this session began on 15 October 2026, Asia/Shanghai. These commits do not establish a multi-week development history. Keep making real commits as you review and improve the project during the course.
- Course platform submission needs the student's own access; the website repository and materials are prepared here, but no course platform submission has been made.

## Before the defence

Read `docs/DEFENCE.md`, understand the state updates in `lab.js`, and review the English copy. Keep `npm run dev` available as the local backup. Verify the submitted public URLs from a signed-out browser.
