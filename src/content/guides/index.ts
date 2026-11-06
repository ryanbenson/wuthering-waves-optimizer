import { GUIDE_IMAGES } from "./images";
import { inlineToPlainText } from "./inline";
import type { Guide, GuideBlock, GuideCategoryId, GuideHubEntry } from "./types";

export type { Guide, GuideBlock, GuideCategoryId, GuideHubEntry } from "./types";

export const GUIDE_CATEGORIES: { id: GuideCategoryId; label: string }[] = [
  { id: "echoes", label: "Get your echoes in" },
  { id: "build", label: "Build and compare" },
  { id: "optimize", label: "Optimize" },
  { id: "numbers", label: "Understand the numbers" },
];

export const GUIDES: Guide[] = [
  {
    slug: "calculator-basics",
    title: "Set up your first character",
    summary: "Weapon, echoes, buffs and enemy, in the order that matters.",
    category: "build",
    action: { label: "Open the Calculator", to: "/" },
    sections: [
      {
        id: "set-up",
        heading: "Set up the build",
        blocks: [
          { type: "text", text: "Set your character up the way you have them in the game. Every screen is in the row across the top, and your stats and damage update as you go." },
          {
            type: "steps",
            items: [
              { title: "Character", text: "Pick the character, then set their level, forte levels, resonance chain and which of their buffs are active." },
              { title: "Weapon", text: "Pick the weapon, its level and rank." },
              { title: "Echoes", text: "Add your five echoes. If your inventory is empty, [get your echoes in](/scanners) first." },
              { title: "Team Buffs", text: "Choose your two teammates and turn on the buffs they give you." },
              { title: "Enemy", text: "Set the enemy's level and resistance, since both change your damage." },
            ],
          },
          { type: "image", image: GUIDE_IMAGES.character },
        ],
      },
      {
        id: "read-numbers",
        heading: "Read the numbers",
        blocks: [
          { type: "text", text: "The bar across the top keeps your key stats and your damage in view on every screen. Damage comes in three kinds:" },
          {
            type: "keyed",
            items: [
              { title: "Normal", text: "The hit without crit." },
              { title: "Average", text: "The hit once your Crit Rate and Crit DMG are factored in." },
              { title: "Crit", text: "The hit assuming 100% Crit Rate." },
            ],
          },
          { type: "text", text: "Next, [find your best loadout](/info/guides/best-loadout) or [build a rotation](/info/guides/rotations)." },
        ],
      },
    ],
  },
  {
    slug: "build-vs-buffs",
    title: "Build vs. buffs on your stats",
    summary: "What your stat bars mean and where each number comes from.",
    category: "build",
    action: { label: "Open the Calculator", to: "/" },
    sections: [
      {
        id: "the-bar",
        heading: "The bar under each stat",
        blocks: [
          { type: "image", image: GUIDE_IMAGES.statBar },
          { type: "text", text: "Each stat has a bar. Gray is your build, the same number as your build card. The colored part is what your buffs add on top. The large number is the total, and it's the one your damage uses." },
        ],
      },
      {
        id: "breakdown",
        heading: "See where a stat comes from",
        blocks: [
          { type: "text", text: "Click a stat in the full breakdown to see your build plus your buffs, with each source listed." },
        ],
      },
    ],
  },
  {
    slug: "echo-presets",
    title: "How presets work",
    summary: "Save groups of echoes and swap between them.",
    category: "build",
    action: { label: "Open your echoes", to: "/?section=echoes" },
    sections: [
      {
        id: "what",
        heading: "What a preset is",
        blocks: [
          { type: "text", text: "A preset is a group of references to echoes in your inventory. An echo's stats stay on the echo, so if you change its substats, every preset using it changes too." },
          { type: "note", text: "**Two presets with the same echoes are copies.** If you save a preset, change an echo's substats, then save a second preset with the same echoes, swapping between them won't change your build." },
        ],
      },
      {
        id: "save",
        heading: "Save a preset",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Put your echoes on", text: "Import them, grab them from your inventory or make new ones." },
              { title: "Open the Presets menu", text: "Choose **Save current echoes as preset** and give it a name. Any echoes not in your inventory get saved there." },
              { title: "Use it anywhere", text: "A preset works on any character, as many times as you like." },
            ],
          },
          { type: "text", text: "If you remove or replace an echo while a preset is applied, the Presets button shows a dot. Its menu lets you update the preset, save the echoes as a new one, or revert to the preset." },
        ],
      },
      {
        id: "use",
        heading: "Use a preset",
        blocks: [
          { type: "text", text: "Open the Presets menu and choose **Browse all presets**. **My presets** are the ones you saved, and **Theorycrafter builds** are recommended builds for this character. Choose **Apply preset** to update your character." },
          { type: "text", text: "Theorycrafter builds don't use echoes from your inventory, but you can save them to your presets from the Presets menu." },
        ],
      },
    ],
  },
  {
    slug: "rotations",
    title: "Build a rotation",
    summary: "Score a whole sequence of attacks, not just one hit.",
    category: "build",
    action: { label: "Open Rotations", to: "/?section=rotations" },
    sections: [
      {
        id: "start",
        heading: "Start a rotation",
        blocks: [
          {
            type: "keyed",
            items: [
              { title: "Create", text: "Start an empty rotation and add your attacks in order." },
              { title: "List Presets", text: "In the **...** menu. Start from a rotation made for this character, then adjust it." },
              { title: "Import", text: "In the **...** menu. Bring in a rotation someone shared." },
            ],
          },
          { type: "image", image: GUIDE_IMAGES.rotations },
        ],
      },
      {
        id: "tune",
        heading: "Make it match how you play",
        blocks: [
          {
            type: "keyed",
            items: [
              { title: "Actions", text: "Each action is one attack and how many times it's used. Use **Add Action**, type an action's name, or **Paste a whole rotation**." },
              { title: "Buffs per action", text: "**Manage Buffs** changes the buffs for one action, like a buff that only lasts part of the rotation." },
              { title: "Duration", text: "Type how long the rotation takes in seconds to get its DPS." },
            ],
          },
          { type: "text", text: "You can also point the [Optimizer](/info/guides/best-loadout) at a rotation, so it finds the best echoes for the whole sequence." },
        ],
      },
    ],
  },
  {
    slug: "team-rotations",
    title: "Team rotations",
    summary: "Chain up to 3 characters' actions and see the team's total.",
    category: "build",
    action: { label: "Open Teams", to: "/teams" },
    sections: [
      {
        id: "start",
        heading: "Set up a team",
        blocks: [
          { type: "note", text: "**Set up each character first.** A team uses each character's build from the Calculator." },
          {
            type: "steps",
            items: [
              { title: "Create a team", text: "Choose **New Team**, or **List Presets** in the **...** menu to start from a ready-made team." },
              { title: "Pick up to 3 characters", text: "**Configure Character** takes you to that character in the Calculator if you need to change their build." },
              { title: "Add actions", text: "Pick who each action is for and add it, or use **Import Rotation** to bring in a character's saved or preset rotation." },
              { title: "Set the duration", text: "Type how long the rotation takes to get the team's DPS." },
            ],
          },
          { type: "image", image: GUIDE_IMAGES.team },
        ],
      },
    ],
  },
  {
    slug: "build-card",
    title: "Make a build card",
    summary: "Turn your build into an image to share.",
    category: "build",
    action: { label: "Open Build Card", to: "/?section=build-card" },
    sections: [
      {
        id: "make",
        heading: "Make your card",
        blocks: [
          { type: "image", image: GUIDE_IMAGES.buildCard },
          {
            type: "steps",
            items: [
              { title: "Finish your build", text: "The card shows your character's build, so set up their weapon and echoes first." },
              { title: "Customize it", text: "Add your username and UID if you want them on the card, upload a background and pick a primary color." },
              { title: "Share it", text: "Choose **Copy to Clipboard** or **Download**." },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "best-loadout",
    title: "Find your best loadout",
    summary: "Run the Optimizer and equip the result.",
    category: "optimize",
    action: { label: "Open the Optimizer", to: "/?section=optimizer" },
    sections: [
      {
        id: "before",
        heading: "Before you start",
        blocks: [
          { type: "note", text: "**It only searches your inventory.** If your inventory is empty, [get your echoes in](/scanners) first. Then set up your character's forte, weapon and buffs as usual, since the search scores loadouts with them." },
        ],
      },
      {
        id: "set-up",
        heading: "Set up the search",
        blocks: [
          {
            type: "image",
            image: GUIDE_IMAGES.optimizerSetup,
            markers: [
              { x: 3, y: 36.6 },
              { x: 3, y: 80.5 },
              { x: 34.4, y: 36.6 },
              { x: 66.2, y: 36.6 },
              { x: 85.3, y: 30.8 },
            ],
          },
          {
            type: "keyed",
            items: [
              { title: "Eligible echo sets", text: "Only echoes from the sets you pick are considered." },
              { title: "Main echo", text: "Every loadout is built around one of these in slot one." },
              { title: "Optimize for", text: "A single attack, a full rotation or a raw stat, then normal, average or crit damage." },
              { title: "Minimum stats", text: "Optional. Every result must [meet all of them](/info/guides/minimum-stats)." },
              { title: "Run Optimizer", text: "The checklist beside it shows anything that's still missing." },
            ],
          },
          { type: "text", text: "Below these, **Echo buffs** lists your set bonuses and main echo buffs. Each one follows your Calculator setting until you change it here." },
        ],
      },
      {
        id: "results",
        heading: "Read the results",
        blocks: [
          {
            type: "image",
            image: GUIDE_IMAGES.optimizerResults,
            markers: [
              { x: 3, y: 26.2 },
              { x: 98, y: 34.9 },
              { x: 86.8, y: 68.7 },
            ],
          },
          {
            type: "keyed",
            items: [
              { title: "Top 5 loadouts", text: "Best first. Pick one to see its echoes below." },
              { title: "The gain", text: "How much it beats what you're wearing now." },
              { title: "Equip loadout", text: "Puts those five echoes on your character." },
            ],
          },
        ],
      },
      {
        id: "slow",
        heading: "If it's slow",
        blocks: [
          { type: "text", text: "More sets and main echoes mean many more combinations, so pick fewer sets to shrink the search. **Worker count** under Advanced settings uses more of your CPU, memory and battery, but going above your device's core count usually won't help." },
        ],
      },
    ],
  },
  {
    slug: "minimum-stats",
    title: "Using minimum stats",
    summary: "Make the Optimizer keep the stats your build can't go without.",
    category: "optimize",
    action: { label: "Open the Optimizer", to: "/?section=optimizer" },
    sections: [
      {
        id: "what",
        heading: "What they do",
        blocks: [
          { type: "text", text: "Every loadout in the results must meet or exceed **all** the minimums you add, like Energy Regen 120 and ATK 2500. A loadout that misses one is dropped, however much damage it does." },
          { type: "text", text: "Use them for what your rotation depends on, like enough Energy Regen to have your Liberation ready. Skip them if you don't need any floors." },
          { type: "note", text: "**No results?** Your minimums may be too high for your inventory. Remove one and run it again." },
        ],
      },
    ],
  },
  {
    slug: "tuning-planner",
    title: "Reading the Tuning Planner",
    summary: "Work out how many echoes it takes to roll what you want.",
    category: "numbers",
    action: { label: "Open the Tuning Planner", to: "/info/tuning-odds" },
    sections: [
      {
        id: "use",
        heading: "Set a goal and read the odds",
        blocks: [
          { type: "image", image: GUIDE_IMAGES.tuning },
          {
            type: "steps",
            items: [
              { title: "Pick your substats", text: "Choose up to 5, or start from a preset like **Double crit**." },
              { title: "Set the lowest roll you'd accept", text: "Each option shows how often a roll qualifies." },
              { title: "Read the chance", text: "**Chance per fresh echo** is how often a +0 echo reaches your goal." },
              { title: "Plan your farming", text: "**If I farm this many echoes** shows the chance that at least one hits." },
            ],
          },
        ],
      },
    ],
  },
];

/** Topics an existing page already covers: the hub links there instead of copying them. */
const PAGE_ENTRIES: GuideHubEntry[] = [
  { title: "Which scanner should I use?", summary: "Compare the four ways to fill your inventory.", to: "/scanners", category: "echoes" },
  { title: "Scan with Wavescan", summary: "A desktop app that scans your whole inventory.", to: "/scanners#wavescan", category: "echoes" },
  { title: "Share your screen", summary: "Click through your echoes while the app reads them.", to: "/scanners#screen-share", category: "echoes" },
  { title: "Upload a recording", summary: "Record the same clicks, then upload the clip.", to: "/scanners#video", category: "echoes" },
  { title: "Import a Discord build card", summary: "Grab one character's echoes from the bot's image.", to: "/scanners#build-card", category: "echoes" },
  { title: "When the Optimizer is slow", summary: "Shrink the search and use workers well.", to: "/info/guides/best-loadout#slow", category: "optimize" },
  { title: "CV, Echo Rating and Substat Score", summary: "What the badges on your echoes mean.", to: "/info/cv-echo-rating", category: "numbers" },
  { title: "How Convene odds are worked out", summary: "The pity curve and rules behind the simulator.", to: "/convene", category: "numbers" },
  { title: "The damage formulas", summary: "How one hit becomes the number you see.", to: "/info/formulas", category: "numbers" },
];

function hubEntryFor(guide: Guide): GuideHubEntry {
  return { title: guide.title, summary: guide.summary, to: `/info/guides/${guide.slug}`, category: guide.category };
}

export const GUIDE_HUB_ENTRIES: GuideHubEntry[] = [...GUIDES.map(hubEntryFor), ...PAGE_ENTRIES];

/** The hub's "New here?" path, in order. */
export const GUIDE_START_PATH = [
  { title: "Get your echoes in", summary: "Pick a scanner and fill your inventory.", to: "/scanners", image: GUIDE_IMAGES.inventory },
  { title: "Set up your first character", summary: "Weapon, echoes, buffs and enemy, in the order that matters.", to: "/info/guides/calculator-basics", image: GUIDE_IMAGES.echoes },
  { title: "Find your best loadout", summary: "Run the Optimizer and equip the result.", to: "/info/guides/best-loadout", image: GUIDE_IMAGES.optimizerTop5 },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

function blockText(block: GuideBlock): string[] {
  if (block.type === "text" || block.type === "note") return [block.text];
  if (block.type === "image") return [block.caption ?? ""];
  return block.items.flatMap((item) => [item.title, item.text]);
}

/** Case-insensitive search over titles, summaries and, for articles, the whole text. */
export function searchGuideEntries(query: string): GuideHubEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GUIDE_HUB_ENTRIES;
  return GUIDE_HUB_ENTRIES.filter((entry) => {
    const article = GUIDES.find((guide) => hubEntryFor(guide).to === entry.to);
    const body = article
      ? article.sections.flatMap((section) => [section.heading, ...section.blocks.flatMap(blockText)])
      : [];
    return [entry.title, entry.summary, ...body].some((text) =>
      inlineToPlainText(text).toLowerCase().includes(q),
    );
  });
}
