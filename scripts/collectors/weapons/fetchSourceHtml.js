const fs = require("fs");
const puppeteer = require("puppeteer");

const weaponPages = [
  "weapon_21010011.html",
  "weapon_21010012.html",
  "weapon_21010013.html",
  "weapon_21010023.html",
  "weapon_21010043.html",
  "weapon_21010053.html",
  "weapon_21010024.html",
  "weapon_21010034.html",
  "weapon_21010044.html",
  "weapon_21010064.html",
  "weapon_21010074.html",
  "weapon_21010015.html",
  "weapon_21010016.html",
  "weapon_21020011.html",
  "weapon_21020012.html",
  "weapon_21020013.html",
  "weapon_21020023.html",
  "weapon_21020043.html",
  "weapon_21020053.html",
  "weapon_21020024.html",
  "weapon_21020034.html",
  "weapon_21020044.html",
  "weapon_21020064.html",
  "weapon_21020074.html",
  "weapon_21020015.html",
  "weapon_21030011.html",
  "weapon_21030012.html",
  "weapon_21030013.html",
  "weapon_21030053.html",
  "weapon_21030023.html",
  "weapon_21030043.html",
  "weapon_21030024.html",
  "weapon_21030044.html",
  "weapon_21030064.html",
  "weapon_21030034.html",
  "weapon_21030074.html",
  "weapon_21030015.html",
  "weapon_21040011.html",
  "weapon_21040012.html",
  "weapon_21040013.html",
  "weapon_21040053.html",
  "weapon_21040023.html",
  "weapon_21040043.html",
  "weapon_21040024.html",
  "weapon_21040044.html",
  "weapon_21040034.html",
  "weapon_21040074.html",
  "weapon_21040064.html",
  "weapon_21040015.html",
  "weapon_21050011.html",
  "weapon_21050012.html",
  "weapon_21050013.html",
  "weapon_21050023.html",
  "weapon_21050043.html",
  "weapon_21050053.html",
  "weapon_21050024.html",
  "weapon_21050034.html",
  "weapon_21050044.html",
  "weapon_21050064.html",
  "weapon_21050074.html",
  "weapon_21050015.html",
  "weapon_21050016.html",
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const url of weaponPages) {
    try {
      const fullUrl = `http://wuthering.wiki/${url}`;
      await page.goto(fullUrl, { waitUntil: "networkidle2" });

      const content = await page.content();

      // Generate a valid filename from the URL
      const filename = url;

      fs.writeFileSync("./source/" + filename, content);
      console.log(`Saved: ${filename}`);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }

  await browser.close();
})();
