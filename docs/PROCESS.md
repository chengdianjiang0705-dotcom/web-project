# Development process / 开发过程

## Date and scope

Work began on 15 October 2026 (Asia/Shanghai). The two supplied PDFs are the specification. All commits use their real creation timestamps. The course's multi-week process criterion cannot be retroactively satisfied by same-day commits.

## Intended milestones

1. Record requirements, five ideas and the preferred project. Establish four page routes and shared navigation.
2. Draw original SVG garments and implement the responsive visual system.
3. Implement part selection, named colors, randomization, reset and preset loading.
4. Add sourced photography, learning content and a filtered six-look gallery.
5. Produce required cover/icons, verify functionality, capture desktop/mobile screenshots and configure deployment.

Each milestone is committed when its corresponding work is complete. Later fixes receive their own commits. `git log --oneline --reverse` is the authoritative commit record.

## Completed stages

| Commit | Actual work |
| --- | --- |
| `94950c3` | Record requirements, shared navigation and static tooling. |
| `3213db0` | Add original garment SVG, five HTML pages and responsive styles. |
| `2f5cb1a` | Implement independent colors, presets, gallery filters, randomize, reset, sharing and exports. |
| `84466bf` | Add credited photographs, original visual assets and the Pages workflow. |
| `5199a3f` | Add the authenticated repository setup helper. |
| `474adcd` | Refine phone rendering, preserve the first cover and add tested course materials. |
| `f565beb` | Merge and preserve the remote repository's original initialization commit. |

The remote repository already contained a single `README.md` initialization commit (`4fe835f`). It was fetched and merged, keeping its ancestry and including the original `web-project` heading in the full README. No force push was used.

The repository is public at https://github.com/chengdianjiang0705-dotcom/web-project. A push to `main` runs static checks and state tests, builds the site and publishes it through GitHub Pages. Test results, original cover iterations and real desktop/phone screenshots are committed as process evidence.

## Decisions

- Use plain HTML, CSS and JavaScript so the state-to-SVG relationship is understandable in the oral defence.
- Maintain one shared navigation/footer module instead of copying their markup into every page.
- Use editable SVG instead of photos for the lab, so garments can change color independently.
- Transfer preset IDs through `lab.html?look=campus-morning`; no account or database is necessary.
- Keep all imagery on disk so the demo can work without third-party image requests.
- Keep color names and selected state in text as well as visual swatches.

## Research

Google search was attempted for Unsplash outfit references. The integrated search browser could not open Google's results page, so web search and original Unsplash/Adobe source pages were used to verify the material. See `SOURCES.md` for direct references.
