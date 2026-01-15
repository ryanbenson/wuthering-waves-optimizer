function processHTML(html) {
  // Remove <a> tags but keep their contents
  html = html.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");

  // Remove all <size> tags (e.g., <size=10>, <size=40>)
  html = html.replace(/<\/?size[^>]*>/gi, "");

  // Convert color spans to class-based spans
  html = html.replace(
    /<span style="color:\s*#a89969;">/gi,
    '<span class="Title">',
  );
  html = html.replace(
    /<span style="color:\s*#f7ca2f;">/gi,
    '<span class="Highlight">',
  );
  html = html.replace(
    /<span style="color:\s*#f0744e;">/gi,
    '<span class="Fusion">',
  );
  html = html.replace(' class="text-sm font-normal"', "");

  return html;
}

// Example usage:
const input = `<div class="text-sm font-normal"><size=40><span style="color: #a89969;"><strong>Basic Attack</strong></span><br>Perform up to 4 consecutive attacks, dealing <span style="color: #f0744e;"><strong>Fusion DMG</strong></span>.<br><size=10><br><size=40><span style="color: #a89969;"><strong>Heavy Attack</strong></span><br>Consume STA to attack the target, dealing <span style="color: #f0744e;"><strong>Fusion DMG</strong></span>.<br><size=10><br><size=40><span style="color: #a89969;"><strong>Basic Attack - Wide Field Observation Mode</strong></span><br>While in <span style="color: #f7ca2f;"><strong>Wide Field Observation Mode</strong></span>, <span style="color: #f7ca2f;"><strong>Basic Attack</strong></span> is replaced with <span style="color: #f7ca2f;"><strong>Basic Attack - Wide Field Observation Mode</strong></span>.<br>Perform up to 3 consecutive attacks, dealing <span style="color: #f0744e;"><strong>Fusion DMG</strong></span>. <br><size=10><br><size=40><span style="color: #a89969;"><strong>Mid-air Attack</strong></span><br>Consume STA to perform Mid-air Plunging Attack, dealing <span style="color: #f0744e;"><strong>Fusion DMG</strong></span>. Press <span style="color: #f7ca2f;"><strong>Normal Attack</strong></span> within a certain time afterward to cast <span style="color: #f7ca2f;"><strong>Basic Attack Stage 3</strong></span>.<br><size=10><br><size=40><span style="color: #a89969;"><strong>Dodge Counter</strong></span><br>Press <span style="color: #f7ca2f;"><strong>Normal Attack</strong></span> right after a successful <span style="color: #f7ca2f;"><strong>Dodge</strong></span> to attack the target, dealing <span style="color: #f0744e;"><strong>Fusion DMG</strong></span>.<br>Press <span style="color: #f7ca2f;"><strong>Normal Attack</strong></span> shortly after performing this attack to perform <span style="color: #f7ca2f;"><strong>Basic Attack Stage 2</strong></span>.<br><size=10><br><size=40><span style="color: #a89969;"><strong>Dodge Counter - Wide Field Observation Mode</strong></span><br>While in <span style="color: #f7ca2f;"><strong>Wide Field Observation Mode</strong></span>, <span style="color: #f7ca2f;"><strong>Dodge Counter</strong></span> is replaced with <span style="color: #f7ca2f;"><strong>Dodge Counter - Wide Field Observation Mode</strong></span>.<br>Press <span style="color: #f7ca2f;"><strong>Normal Attack</strong></span> right after a successful <span style="color: #f7ca2f;"><strong>Dodge</strong></span> to counterattack and deal <span style="color: #f0744e;"><strong>Fusion DMG</strong></span>.<br>Within a certain time afterward, press <span style="color: #f7ca2f;"><strong>Normal Attack</strong></span> to cast <span style="color: #f7ca2f;"><strong>Basic Attack - Wide Field Observation Mode Stage 3</strong></span>.</size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></div>`;

const output = processHTML(input);
console.log(output);
