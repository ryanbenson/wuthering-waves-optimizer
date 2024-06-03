const fs = require("fs");
const cheerio = require("cheerio");

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

weaponPages.forEach((htmlFile) => {
  const htmlContent = fs.readFileSync("./source/" + htmlFile, "utf-8");

  const $ = cheerio.load(htmlContent);

  const weapons = [];

  $(".content-container").each((index, element) => {
    const name = $(element).find(".name").text().trim();
    const description = $(element).find(".description").text().trim();
    const type = $(element)
      .find(".basetable .baseinfo")
      .html()
      .match(/Weapon Type: (.*?)<br/)[1];
    const rarity = parseInt(
      $(element)
        .find(".basetable .baseinfo")
        .html()
        .match(/Rarity: (.*?)\-star<br/)[1]
    );

    const passiveName = $(element).find(".skillname").text().trim();
    const passiveValue = $(element).find(".skilldescription").text().trim();

    const table = $(element).find(".baseinfo .stats");
    const rows = table.find("tr");
    const modifier = $(rows[0]).find("th").eq(2).text().trim();

    const levels = {};
    rows.slice(1).each((i, row) => {
      const level = $(row).find("td").eq(0).text().trim();
      const attack = parseInt($(row).find("td").eq(1).text().trim());
      const modifierValue =
        parseFloat($(row).find("td").eq(2).text().trim().replace("%", "")) /
        100;

      levels[level] = { attack, modifier, modifierValue };
    });

    weapons.push({
      name,
      description,
      type,
      rarity,
      passiveName,
      passiveValue,
      levels,
    });
  });

  weapons.forEach((weapon) => {
    const {
      name,
      description,
      type,
      rarity,
      passiveName,
      passiveValue,
      levels,
    } = weapon;
    const pascalCaseName = name
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
      .replace(/[^a-zA-Z0-9]/g, "");

    const weaponInfo = {
      name,
      description,
      type,
      rarity,
      passiveName,
      passiveValue,
    };

    const weaponData = levels;

    const fileContent = `
interface WeaponInfo {
  name: string;
  description: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue: string;
}

interface WeaponLevelData {
  attack: number;
  modifier: string;
  modifierValue: number;
}

interface WeaponData {
  [level: string]: WeaponLevelData;
}

const weaponInfo: WeaponInfo = ${JSON.stringify(weaponInfo, null, 2)};

const weaponData: WeaponData = ${JSON.stringify(weaponData, null, 2)};

export function getWeaponInfo(): WeaponInfo {
  return weaponInfo;
}

export function getWeaponData(): WeaponData {
  return weaponData;
}

export function getWeaponDataByLevel(level: string): WeaponLevelData {
  return weaponData[level];
}
`;

    fs.writeFileSync(`./weapons/${pascalCaseName}.ts`, fileContent.trim());
  });
});
