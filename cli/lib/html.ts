export function decodeHtml(text: string): string {
  return text
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\u0022/gi, '"')
    .replace(/\\u0027/gi, "'")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

export function cleanHtml(html: string): string {
  return html
    .replace(/<te\b[^>]*>([\s\S]*?)<\/te>/gi, "$1")
    .replace(
      /class="font-bold font-whitney text-3xl style="color:[^"]*;"/g,
      'class="Title"',
    );
}

export function decodeAndCleanHtml(text: string): string {
  return cleanHtml(decodeHtml(text));
}

export function wrapDescriptionHtml(description: string): string {
  const decoded = decodeAndCleanHtml(description).trim();
  if (!decoded) {
    return "<div></div>";
  }

  if (/^<div[\s>]/i.test(decoded)) {
    return decoded;
  }

  return `<div>${decoded}</div>`;
}

export function formatTemplateString(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  return `\`${escaped}\``;
}
