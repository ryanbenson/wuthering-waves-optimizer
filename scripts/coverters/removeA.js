function processHTML(html) {
  // Remove <a> tags but keep their contents
  html = html.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");

  // Remove all <size> tags (e.g., <size=10>, <size=40>)
  html = html.replace(/<\/?size[^>]*>/gi, "");

  // Convert color spans to class-based spans
  html = html.replace(
    `<span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">`,
    '<span class="Title">',
  );
  html = html.replace(
    /<span style="color:\s*#a89969;">/gi,
    '<span class="Title">',
  );
  html = html.replace(
    /<span style="color:\s*#f7ca2f;" class="font-bold">/gi,
    '<span class="Highlight">',
  );
  html = html.replace(
    /<span style="color:\s*#ffd12f;" class="font-bold">/gi,
    '<span class="Highlight">',
  );
  html = html.replace(
    /<span style="color:\s*#f0744e;" class="font-bold">/gi,
    '<span class="Fusion">',
  );
  html = html.replace(
    /<span style="color:\s*#c7ffed;" class="font-bold">/gi,
    '<span class="Wind">',
  );
  html = html.replace(' class="text-sm font-normal"', "");

  return html;
}

// Example usage:
const input = `<div data-v-0c496552="" class="term-reference text-gray-200"><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Basic Attack</span><br><br>Perform up to 4 consecutive attacks, dealing <span style="color:#c7ffed" ;="">Aero DMG</span>.<br>Enter <span style="color:#ffd12f;" class="font-bold">Decipher</span> state for 5s after casting <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 4</span>. This effect ends early if Sigrika is switched off the field.<br>When Sigrika has at least 50 points of <span style="color:#ffd12f;" class="font-bold"><span class="term-reference-link cursor-pointer" data-term-id="141202">Full Stop</span></span>, her Basic Attack cycle starts from Stage 2.<br><size=10><br><br><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Basic Attack - Elucidated</span><br><br>In the <span style="color:#ffd12f;" class="font-bold"><span class="term-reference-link cursor-pointer" data-term-id="141207">Decipher</span></span> state, press Normal Attack on the ground to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Elucidated</span>, dealing <span style="color:#c7ffed" ;="">Aero DMG</span> (considered Echo Skill DMG).<br>Leave the <span style="color:#ffd12f;" class="font-bold"><span class="term-reference-link cursor-pointer" data-term-id="141207">Decipher</span></span> state upon casting this skill.<br><size=10><br><br><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Heavy Attack</span><br><br>Consume STA to attack the target, dealing <span style="color:#c7ffed" ;="">Aero DMG</span>.<br><span style="color:#ffd12f;" class="font-bold">Press Normal Attack</span> shortly after casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack</span> to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 2</span>.<br><size=10><br><br><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Mid-air Attack</span><br><br>Consume STA to perform Plunging Attack, dealing <span style="color:#c7ffed" ;="">Aero DMG</span>.<br><span style="color:#ffd12f;" class="font-bold">Press Normal Attack</span> shortly after casting Plunging Attack to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 2</span>.<br><size=10><br><br><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Dodge Counter</span><br><br><span style="color:#ffd12f;" class="font-bold">Press Normal Attack</span> shortly after a successful Dodge on the ground to attack the target, dealing <span style="color:#c7ffed" ;="">Aero DMG</span>.<br><span style="color:#ffd12f;" class="font-bold">Press Normal Attack</span> shortly after casting <span style="color:#ffd12f;" class="font-bold">Dodge Counter</span> to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 4</span>.<br><size=10><br><br><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Dodge Counter - Decipher</span><br><br>In the <span style="color:#ffd12f;" class="font-bold"><span class="term-reference-link cursor-pointer" data-term-id="141207">Decipher</span></span> state, <span style="color:#ffd12f;" class="font-bold">press Normal Attack</span> shortly after a successful Dodge on the ground to cast <span style="color:#ffd12f;" class="font-bold">Dodge Counter - Decipher</span> to attack the target, dealing <span style="color:#c7ffed" ;="">Aero DMG</span> (considered Echo Skill DMG).<br>Leave the <span style="color:#ffd12f;" class="font-bold"><span class="term-reference-link cursor-pointer" data-term-id="141207">Decipher</span></span> state upon casting this skill.<br><size=10><br><br><span class="font-bold font-whitney text-3xl style=" color:aliceblue;"="">Mid-air Dodge Counter</span><br><br><span style="color:#ffd12f;" class="font-bold">Press Normal Attack</span> shortly after a successful Dodge in mid-air to attack the target, dealing <span style="color:#c7ffed" ;="">Aero DMG</span>.<br><span style="color:#ffd12f;" class="font-bold">Press Normal Attack</span> shortly after casting <span style="color:#ffd12f;" class="font-bold">Mid-air Dodge Counter</span> to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack Stage 2</span>.</size=10></size=10></size=10></size=10></size=10></size=10></div>`;

const output = processHTML(input);
console.log(output);
