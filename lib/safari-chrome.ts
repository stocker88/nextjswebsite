/** Match Safari's toolbar generation, not the iPhone hardware model.
 * Safari 26 freezes the OS token at 18.x; Version/ is the browser version.
 * Unknown browsers retain the transparent behavior instead of being guessed.
 */
export function usesLegacySafariChrome(userAgent: string, maxTouchPoints = 0): boolean {
  const mobileApple = /iPhone|iPad|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);
  if (!mobileApple || !/Safari\//i.test(userAgent) ||
      /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(userAgent)) return false;
  const version = userAgent.match(/Version\/(\d+)(?:\.|\s|$)/i);
  if (!version) return false;
  const major = Number(version[1]);
  return major > 0 && major < 26;
}
