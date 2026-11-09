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
              { title: "Timing", text: "Each action's frame chip shows how long it takes. Click it to set how the action ends (cancel, dash, jump or swap), and the rotation's length and DPS update." },
              { title: "Duration", text: "Optional. Type how long the rotation takes in seconds to get a DPS from your own timing as well." },
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
              { title: "Check the timing", text: "The team's length and DPS come from each action's frame data. Set how an action ends from its frame chip, or type your own duration to compare." },
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
              { title: "Pick a layout", text: "**Columns** puts the art, stats and echoes side by side. **Hero** shows big art with your echoes in a row. **Showcase** fills the card with art and puts every stat on one panel." },
              { title: "Customize it", text: "Open **Customize** to add your username and UID, pick character art and a background, or upload your own. The opacity slider fades the background if it's too busy. You can also pick a primary color." },
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
  {
    slug: "scan-echoes",
    title: "Scan your echoes from the game",
    summary: "Click through your echoes in the game, or record it, and let the app read them.",
    category: "echoes",
    action: { label: "Open the scanner", to: "/inventory?open=scan" },
    sections: [
      {
        id: "share",
        heading: "Share your screen",
        blocks: [
          { type: "text", text: "The scanner watches your game window while you click through your echoes, reads each one, and gives you a list to check before anything is saved. It takes about 2 seconds per echo." },
          {
            type: "steps",
            items: [
              {
                title: "Before you start",
                points: [
                  "Use desktop **Chrome or Edge** with the game set to **English**.",
                  "Run the game full screen, or in a window, at any **16:10 or 16:9** resolution (e.g. 2560×1600 or 1920×1080). Ultrawide isn't supported yet.",
                ],
              },
              {
                title: "In the game: open your echoes",
                points: [
                  "Open **Backpack → Echoes** (the Echo Management screen).",
                  "Click the first echo you want scanned so its details show on the right.",
                ],
              },
              {
                title: "In the app: start sharing",
                points: [
                  "Click **Share screen (live)** in the scanner.",
                  "In the browser's picker, choose the **Window** tab and pick **Wuthering Waves**, not your entire screen.",
                ],
              },
              {
                title: "Back in the game: click, wait, click",
                points: [
                  "**Click an echo → wait about 2 seconds → click the next one.** Repeat for every echo you want.",
                  "Keep the detail panel fully visible. Don't leave a tooltip or menu over it.",
                  "Going faster can skip echoes. If one is skipped, just click back to it.",
                ],
              },
              {
                title: "Stop scanning",
                points: ["Switch back to the app and click **Stop scanning**. Anything still being read finishes on its own."],
              },
              {
                title: "Check the results",
                points: [
                  "The list opens on **Needs attention**: only the echoes the scanner wasn't sure about.",
                  "Compare each one with its **in-game capture**. If it matches, click **Looks right**. If not, click **Edit** to fix it (the capture is shown in the editor too).",
                  "**Unknown echo** means the name wasn't recognized. Pick the echo in Edit, or remove it.",
                  "Each echo is numbered in the order you clicked it, so you can find it in the game if you need to.",
                ],
              },
              {
                title: "Save",
                points: ["The save button says exactly what will happen. Echoes already in your inventory are left unchecked on the next step, so you won't save them twice by accident."],
              },
            ],
          },
        ],
      },
      {
        id: "recording",
        heading: "Using a recording instead",
        blocks: [
          {
            type: "list",
            items: [
              "Record yourself clicking through echoes the same way (click, wait about 2 seconds, click next) with OBS, GeForce Experience, or similar.",
              "Choose **Upload a video**, drag the start and end past any menus, and keep the default 4 frames/sec.",
              "The video stays on your device. It's never uploaded.",
            ],
          },
        ],
      },
      {
        id: "tips",
        heading: "Tips",
        blocks: [
          {
            type: "list",
            items: [
              "Any in-game sort order works.",
              "Clicking the same echo twice is fine. Repeats are merged.",
              "Newly obtained echoes with no main stat chosen yet are skipped.",
              "Turn on **Beep on each capture** to hear when an echo was read, so you know it's safe to click the next one.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "discord-build-card",
    title: "Import a Discord build card",
    summary: "Read one character's echoes from the image Kuro's Discord bot makes.",
    category: "echoes",
    action: { label: "Import a build card", to: "/inventory?open=import" },
    sections: [
      {
        id: "how",
        heading: "Get the card in",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Make the card", text: "In the Wuthering Waves Discord (or ours), run **/bind** once, then **/create**." },
              { title: "Save the original", text: "Download the bot's image as it is. Re-shared copies lose quality and read worse." },
              { title: "Upload it here", text: "Open **Import echoes** in your inventory, add the image and check what it read." },
            ],
          },
        ],
      },
      {
        id: "tips",
        heading: "Tips",
        blocks: [
          {
            type: "list",
            items: [
              "In the WuWa Discord (or ours), run /bind once, then /create to generate the image. The bot is made by Kuro, so your account is safe.",
              "Use the bot's original image. Re-uploads through Discord, Reddit, etc. lower quality and hurt parsing.",
              "Parsing takes a moment and isn't perfect. Check the results afterwards.",
              "English only for now.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "echo-ratings",
    title: "How echo grades work",
    summary: "What Echo Rating and Substat Score measure, with a worked example.",
    category: "numbers",
    action: { label: "Try scoring an echo", to: "/info/cv-echo-rating" },
    sections: [
      {
        id: "points",
        heading: "How points work",
        blocks: [
          { type: "text", text: "Each substat can roll one of several possible values. A higher roll is worth more points, from 1 (the worst possible roll) up to 8 (the best). Most substats have 8 possible rolls. Two of them, flat ATK and flat DEF, only have 4 possible rolls." },
          { type: "text", text: "A fully revealed echo has 5 substats. Adding up the points from all 5 gives a total between 5 (worst possible) and 40 (best possible)." },
        ],
      },
      {
        id: "echo-rating",
        heading: "Echo Rating (E to SSS)",
        blocks: [
          { type: "text", text: "This is the letter grade shown on every echo, everywhere: the inventory, echo browsers, build cards, and optimizer results. It's simply that point total turned into a grade. See every band on [CV & Echo Rating](/info/cv-echo-rating)." },
          { type: "text", text: "By default, every substat counts equally. Click **Customize Weights** if you want to tell the app which substats matter most to you. The grade still uses this same E to SSS scale either way." },
        ],
      },
      {
        id: "substat-score",
        heading: "Substat Score (0% to 100%)",
        blocks: [
          { type: "text", text: "This score is different: instead of grading the echo on its own, it grades how good the echo is for one specific character. You'll see it wherever an echo is tied to a character, like an equipped echo or a build card." },
          { type: "text", text: "It uses that character's own substat priorities, and it compares the echo to that character's best possible echo, not just to itself. So if an echo is missing a substat the character really wants, that counts against it, even if every substat it does have rolled perfectly." },
        ],
      },
      {
        id: "example",
        heading: "Worked example",
        blocks: [
          { type: "text", text: "Say a character's priorities are Crit Rate (highest), Crit DMG (highest), ATK% (medium), and Resonance Liberation DMG Bonus (lower). Here's an echo with these 5 substats:" },
          {
            type: "keyed",
            items: [
              { title: "Crit DMG 15%", text: "A decent roll, worth 3 of 8 points." },
              { title: "ATK% 8.6%", text: "4 of 8 points." },
              { title: "Energy Regen 10%", text: "Not a priority for this character, so 0 points." },
              { title: "Resonance Liberation DMG Bonus 10.9%", text: "A strong roll, worth 7 of 8 points." },
              { title: "Resonance Skill DMG Bonus 11.6%", text: "Not a priority for this character, so 0 points." },
            ],
          },
          { type: "text", text: "Notice this echo has no Crit Rate substat at all, even though it's this character's top priority. That's a real weakness, and the score reflects it: the echo only earns points on 3 of its 5 substats, and it's being compared to this character's ideal echo, which would also roll well on Crit Rate. Adding it all up, this echo scores about 32%, a C." },
        ],
      },
      {
        id: "priorities",
        heading: "Setting priorities",
        blocks: [
          { type: "text", text: "Some characters come with a starting set of priorities already filled in. Others start with no priorities set, so every substat counts equally until you customize them. Click **Customize Weights** from a character's Echoes screen to set that character's own priorities." },
          { type: "text", text: "Flat ATK and flat DEF only have 4 possible rolls instead of 8. Flat HP still has all 8, just like a percent-based substat. The score accounts for this automatically, so a substat with fewer possible rolls can't outscore one with more just by being present." },
          { type: "note", text: "**An asterisk after a grade** (*) means the echo has fewer than 5 revealed substats. The score is provisional, and it will likely change as the echo levels up and reveals the rest." },
        ],
      },
    ],
  },
  {
    slug: "convene-odds",
    title: "How Convene odds are worked out",
    summary: "The rates and pity curve behind the Convene simulator.",
    category: "numbers",
    action: { label: "Open Convene", to: "/convene" },
    sections: [
      {
        id: "rates",
        heading: "The rates it uses",
        blocks: [
          { type: "text", text: "**Character** (featured resonator): 50/50 on the rate-up 5★, with the next 5★ guaranteed rate-up if you miss. The 5★ pity curve below comes from a large-sample analysis of player convenes (not Kuro's server code): ~1.848% of pulls are 5★ (~54.1 pulls expected to any 5★), ~81.15 pulls expected to a featured 5★; published banner rates are ~1.8% for 5★ and ~12% for 4★." },
          { type: "text", text: "**Weapon** (featured weapon): same 5★ curve as other non-beginner banners; every 5★ is the promotional weapon (100%). Featured 4★ weapon rules are not modeled here." },
        ],
      },
      {
        id: "curve",
        heading: "The 5★ pity curve",
        blocks: [
          {
            type: "list",
            items: [
              "0.8% flat on pulls 1–65",
              "+4% per pull on 66–70",
              "+8% per pull on 71–75",
              "+10% per pull on 76–78",
              "100% on pull 79",
            ],
          },
          { type: "text", text: "Pulls count from the last 5★. The 4★ floor after nine consecutive 3★ pulls (counter resets on any 4★ or 5★) is omitted: 5★ is resolved first, so it does not change how many 5★s you get." },
        ],
      },
    ],
  },
];

/** Topics an existing page already covers: the hub links there instead of copying them. */
const PAGE_ENTRIES: GuideHubEntry[] = [
  { title: "Which scanner should I use?", summary: "Compare the four ways to fill your inventory.", to: "/scanners", category: "echoes" },
  { title: "Scan with Wavescan", summary: "A desktop app that scans your whole inventory.", to: "/scanners#wavescan", category: "echoes" },
  { title: "Upload a recording", summary: "Record the same clicks, then upload the clip.", to: "/info/guides/scan-echoes#recording", category: "echoes" },
  { title: "When the Optimizer is slow", summary: "Shrink the search and use workers well.", to: "/info/guides/best-loadout#slow", category: "optimize" },
  { title: "Score a sample echo", summary: "Click the rolls and watch CV and the grade change.", to: "/info/cv-echo-rating", category: "numbers" },
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
  if (block.type === "list") return block.items;
  if (block.type === "steps") return block.items.flatMap((item) => [item.title, item.text ?? "", ...(item.points ?? [])]);
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
