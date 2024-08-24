/**
 * Generates a random string
 * @param len - how many characters to generate, defaults to 10
 * @returns
 */
export function randomString(len: number = 10): string {
  return Math.random().toString(36).substr(2, len);
}
