import { useEffect, useState } from "react";

// Base64 alphabet, same characters the stored ciphertext is made of
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const FRAME_MS = 40;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Spaces stay spaces so the shape of the text is visible while it decrypts
const scramble = (text: string) =>
  [...text].map((c) => (c === " " ? c : randomGlyph())).join("");

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type DecryptTextProps = {
  text: string;
  duration?: number;
};

// Plays a terminal-style decrypt effect whenever `text` changes
export default function DecryptText({
  text,
  duration = 600,
}: DecryptTextProps) {
  const [reducedMotion] = useState(prefersReducedMotion);
  // Remember which text the frame belongs to, so a new value never shows a stale frame
  const [frame, setFrame] = useState({ text: "", display: "" });

  useEffect(() => {
    if (reducedMotion) return;

    const chars = [...text];
    const start = performance.now();

    const id = setInterval(() => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      const revealed = Math.floor(progress * chars.length);

      setFrame({
        text,
        display:
          chars.slice(0, revealed).join("") +
          scramble(chars.slice(revealed).join("")),
      });

      if (progress === 1) clearInterval(id);
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [text, duration, reducedMotion]);

  if (reducedMotion) return <span>{text}</span>;

  // Before the first frame of a new value, mask it instead of flashing the plaintext
  const display =
    frame.text === text ? frame.display : text.replace(/\S/g, "#");

  return <span>{display}</span>;
}
