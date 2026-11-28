import { useEffect, useEffectEvent } from "react";

// Return true when the key was used, so the browser default (scrolling, button
// clicks...) is skipped and no other listener handles it again.
type KeyHandler = (key: string, e: KeyboardEvent) => boolean | void;

export const isModalOpen = () =>
  Boolean(document.getElementById("modal-root")?.hasChildNodes());

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable);

export const useKeyboard = (handler: KeyHandler, enabled = true) => {
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.defaultPrevented) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isTyping(e.target) || isModalOpen()) return;

    // Letters are matched lowercase so Shift / Caps Lock don't matter
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (handler(key, e) === true) e.preventDefault();
  });

  useEffect(() => {
    if (!enabled) return;

    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [enabled]);
};

// Lets on-screen buttons go through the exact same path as the keyboard
export const pressKey = (key: string) => {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, cancelable: true }));
};
