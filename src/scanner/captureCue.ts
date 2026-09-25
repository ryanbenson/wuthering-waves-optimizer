/**
 * Optional audible "got it" blip each time the live scanner captures an
 * echo. The user is usually full screen in the game and can't see the
 * app's counter, so a sound is the only way to know it's safe to click
 * the next echo — often sooner than a fixed ~2s wait.
 *
 * WebAudio oscillator, no asset file. The AudioContext must be created
 * from a user gesture (the Start click) or browsers keep it suspended, so
 * callers `open()` there and `close()` when the session ends.
 */
export function createCaptureCue() {
  let context: AudioContext | null = null;

  function open() {
    if (context) return;
    try {
      context = new AudioContext();
    } catch {
      context = null; // no audio support — the cue is best-effort
    }
  }

  function play() {
    if (!context) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    // Quick fade in/out so the blip doesn't click.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.09);
  }

  function close() {
    void context?.close().catch(() => {});
    context = null;
  }

  return { open, play, close };
}
