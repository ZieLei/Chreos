import { useEffect, useEffectEvent, useRef } from "react";
import type { ModalProps } from "../types/types";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key !== "Tab" || !panelRef.current) return;

    // Keep Tab / Shift+Tab cycling inside the modal
    const items = [
      ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ];
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;

    const outside = !panelRef.current.contains(document.activeElement);

    if (e.shiftKey && (outside || document.activeElement === first)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (outside || document.activeElement === last)) {
      e.preventDefault();
      first.focus();
    }
  });

  useEffect(() => {
    if (!open) return;

    // autoFocus inside the modal wins, otherwise focus the panel itself
    if (!panelRef.current?.contains(document.activeElement)) {
      panelRef.current?.focus();
    }

    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="rounded-sm border-2 border-mint-green bg-black p-6 font-terminal text-mint-green outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") ?? document.body,
  );
}
