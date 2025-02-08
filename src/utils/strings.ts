/**
 * Generates a random string
 * @param len - how many characters to generate, defaults to 10
 * @returns
 */
export function randomString(len: number = 10): string {
  return Math.random().toString(36).substr(2, len);
}

export function slugify(input: string): string {
    if (!input)
        return '';

    // make lower case and trim
    let slug = input.toLowerCase().trim();

    // remove accents from charaters
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // replace invalid chars with spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

    // replace multiple spaces or hyphens with a single hyphen
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
}