# How to collect weapon data

How it works is:

1. Go to http://wuthering.wiki and go to the weapons page. Get all page filenames
1. Fetch the HTML source from http://wuthering.wiki for each weapon
1. Parse the HTML source and create the weapon TypeScript file
1. Copy the files into the weapons directory

Make sure to install dependencies (puppeteer, and cheerio)

```javascript
let links = [];
let weapons = document.querySelectorAll(".itemgrid a");
weapons.forEach((link) => {
  links.push(link.getAttribut("href"));
});
```

Then update the list of HTML files in both the JS files here. Then run:

```
node fetchSourceHtml.js
node convertSourceToWeaponFile.js
```
