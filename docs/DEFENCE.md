# Five-minute defence / 五分钟答辩

Use the live website, without presentation slides. The first three minutes demonstrate the project; the remaining two minutes are for questions.

## Three-minute demonstration

**0:00–0:25 · Purpose**

“My project is Outfit Color Lab. It helps university students try clothing colors using pieces they already own.”

说明目标用户、用途。打开 Color Lab，先展示核心功能。

**0:25–1:15 · Main task**

Select Top and choose Olive. Select Trousers and choose Beige. Select Shoes and choose Off-white. Show that the other two pieces keep their colors. Point to the current palette and named swatches.

“I store the colors in a JavaScript object. When the user selects a color, I update the chosen part, the SVG and the text together.”

**1:15–1:45 · Explore**

Press Surprise me and explain that it tries a random combination. Press Start fresh. Open Outfit Gallery, choose Blues, then try Blue Hour. Show that the lab loads the exact preset.

“The preset ID travels in the URL. This lets the gallery link directly to a combination without a database.”

**1:45–2:20 · Supporting pages**

Open Color Guide and briefly explain the three starting points. Use a Try this combination link. Return Home and show that all four pages are connected through the shared navigation.

**2:20–3:00 · Mobile and decisions**

Show the 390 px screenshot or use DevTools responsive mode. Demonstrate the mobile navigation menu. Show the repository's actual commits and credited sources if time allows.

“I chose simple SVG illustrations so users can focus on color. On a phone, the preview sits above the controls. Each swatch has a name, so the controls do not rely only on color.”

## Questions to prepare

**Why use a button instead of a link?**

“A button performs an action, like recoloring a garment. A link takes the visitor to another page.”

**How does changing color work?**

`selectedPart` identifies the garment. `outfit[selectedPart] = hex` updates the state. `render()` sets the SVG's `--top`, `--trousers` and `--shoes` CSS variables and updates the labels and `aria-pressed` states.

**Why no account or database?**

“The main task only needs temporary state. The course also limits features that depend on stored accounts or orders.”

**What are the limits?**

“The colors are illustrative. Fabric, material and lighting affect real clothes. This tool does not perform virtual fitting or determine a best color for everybody.”

**What would you improve?**

“I would add an optional comparison view after observing how students compare two palettes. I would keep the basic editor simple.”

**Did you use AI?**

“Yes. AI assisted with code, draft copy, original vector artwork and testing. I reviewed the implementation and can explain how it works.”

Use this last sentence only after you actually review and understand the implementation. Be candid about assistance and the actual dates of the commit history.

## Local backup

Run `npm run dev` from the repository and open http://127.0.0.1:4173. All website images are local and no font service is required. This backup does not replace the public site.
