import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  MONTHS,
  addDays,
  addMonths,
  calendarDays,
  isSameDay,
  parseDate,
  toIsoDate,
} from "../utils/date";

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const YEARS_PER_PAGE = 12;
const POPUP_HEIGHT = 400;

export type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
};

const navButtonClass =
  "px-2 text-dark-cyan active:bg-dark-cyan active:text-mint-green";

export default function DatePicker({
  value,
  onChange,
  optional = false,
  autoFocus,
  placeholder = "SELECT DATE",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"days" | "years">("days");
  const [cursor, setCursor] = useState(() => parseDate(value) ?? new Date());
  const [dropUp, setDropUp] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const selected = parseDate(value);
  const [now] = useState(() => new Date());

  useEffect(() => {
    if (open) popupRef.current?.focus();
  }, [open]);

  // Clicking anywhere else closes it
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function openPicker() {
    // Open upwards when there's no room below (e.g. fields at the bottom of a modal)
    const rect = triggerRef.current?.getBoundingClientRect();
    setDropUp(!!rect && window.innerHeight - rect.bottom < POPUP_HEIGHT);
    setCursor(parseDate(value) ?? new Date());
    setView("days");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function pick(date: Date) {
    onChange(toIsoDate(date));
    close();
  }

  function clear() {
    onChange("");
    close();
  }

  function handleDayKey(e: KeyboardEvent): boolean {
    switch (e.key) {
      case "ArrowLeft":
        setCursor(addDays(cursor, -1));
        return true;
      case "ArrowRight":
        setCursor(addDays(cursor, 1));
        return true;
      case "ArrowUp":
        setCursor(addDays(cursor, -7));
        return true;
      case "ArrowDown":
        setCursor(addDays(cursor, 7));
        return true;
      case "PageUp":
        setCursor(addMonths(cursor, e.shiftKey ? -12 : -1));
        return true;
      case "PageDown":
        setCursor(addMonths(cursor, e.shiftKey ? 12 : 1));
        return true;
      case "Home":
        setCursor(addDays(cursor, -cursor.getDay()));
        return true;
      case "End":
        setCursor(addDays(cursor, 6 - cursor.getDay()));
        return true;
      case "Enter":
      case " ":
        pick(cursor);
        return true;
      case "Escape":
        close();
        return true;
    }

    switch (e.key.toLowerCase()) {
      case "t":
        setCursor(new Date());
        return true;
      case "y":
        setView("years");
        return true;
    }

    if (optional && (e.key === "Delete" || e.key === "Backspace")) {
      clear();
      return true;
    }

    return false;
  }

  function handleYearKey(e: KeyboardEvent): boolean {
    const moveYears = (years: number) =>
      setCursor(addMonths(cursor, years * 12));

    switch (e.key) {
      case "ArrowLeft":
        moveYears(-1);
        return true;
      case "ArrowRight":
        moveYears(1);
        return true;
      case "ArrowUp":
        moveYears(-4);
        return true;
      case "ArrowDown":
        moveYears(4);
        return true;
      case "PageUp":
        moveYears(-YEARS_PER_PAGE);
        return true;
      case "PageDown":
        moveYears(YEARS_PER_PAGE);
        return true;
      case "Enter":
      case " ":
      case "Escape":
        setView("days");
        return true;
    }

    return false;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const handled = view === "days" ? handleDayKey(e) : handleYearKey(e);

    if (handled) {
      e.preventDefault();
      // Keeps ESC from also closing the modal around the picker
      e.stopPropagation();
    }
  }

  const yearPageStart =
    cursor.getFullYear() - (cursor.getFullYear() % YEARS_PER_PAGE);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        autoFocus={autoFocus}
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openPicker();
          }
        }}
        className="group flex flex-row justify-between w-full border-2 border-mint-green bg-black text-2xl text-mint-green outline-none px-2 focus:bg-mint-green focus:text-dark-cyan"
      >
        <span
          className={value ? "" : "text-deep-teal group-focus:text-dark-cyan"}
        >
          {value || placeholder}
        </span>
        <span>{"[ ▦ ]"}</span>
      </button>

      {open && (
        <div
          ref={popupRef}
          tabIndex={-1}
          role="dialog"
          aria-label="Choose date"
          onKeyDown={handleKeyDown}
          // Keep focus on the popup so the keyboard keeps working after clicks
          onMouseDown={(e) => e.preventDefault()}
          onBlur={(e) => {
            if (!wrapperRef.current?.contains(e.relatedTarget)) setOpen(false);
          }}
          className={`absolute left-0 z-20 w-80 border-2 border-mint-green bg-black p-2 text-2xl outline-none ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="flex flex-row justify-between bg-mint-green text-dark-cyan">
            <div className="flex flex-row">
              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setCursor(
                    addMonths(
                      cursor,
                      view === "days" ? -12 : -YEARS_PER_PAGE * 12,
                    ),
                  )
                }
                className={navButtonClass}
              >
                {"«"}
              </button>
              {view === "days" && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setCursor(addMonths(cursor, -1))}
                  className={navButtonClass}
                >
                  {"‹"}
                </button>
              )}
            </div>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setView(view === "days" ? "years" : "days")}
              className={navButtonClass}
            >
              {view === "days"
                ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
                : `${yearPageStart} - ${yearPageStart + YEARS_PER_PAGE - 1}`}
            </button>
            <div className="flex flex-row">
              {view === "days" && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setCursor(addMonths(cursor, 1))}
                  className={navButtonClass}
                >
                  {"›"}
                </button>
              )}
              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setCursor(
                    addMonths(
                      cursor,
                      view === "days" ? 12 : YEARS_PER_PAGE * 12,
                    ),
                  )
                }
                className={navButtonClass}
              >
                {"»"}
              </button>
            </div>
          </div>

          {view === "days" ? (
            <div className="grid grid-cols-7 mt-2 text-center">
              {WEEKDAYS.map((day) => (
                <span key={day} className="text-cloud-sky">
                  {day}
                </span>
              ))}
              {calendarDays(cursor).map((day) => {
                const inMonth = day.getMonth() === cursor.getMonth();
                const isSelected = isSameDay(day, selected);

                return (
                  <button
                    key={toIsoDate(day)}
                    type="button"
                    tabIndex={-1}
                    onClick={() => pick(day)}
                    className={`${
                      isSelected
                        ? "bg-mint-green text-dark-cyan"
                        : inMonth
                          ? "text-mint-green"
                          : "text-deep-teal"
                    } ${isSameDay(day, cursor) ? "outline-2 -outline-offset-2 outline-cloud-sky" : ""} ${
                      isSameDay(day, now) ? "underline" : ""
                    }`}
                  >
                    {String(day.getDate()).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1 mt-2 text-center">
              {Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
                const year = yearPageStart + i;

                return (
                  <button
                    key={year}
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      setCursor(
                        addMonths(cursor, (year - cursor.getFullYear()) * 12),
                      );
                      setView("days");
                    }}
                    className={`py-1 ${
                      year === selected?.getFullYear()
                        ? "bg-mint-green text-dark-cyan"
                        : "text-mint-green"
                    } ${year === cursor.getFullYear() ? "outline-2 -outline-offset-2 outline-cloud-sky" : ""} ${
                      year === now.getFullYear() ? "underline" : ""
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-row justify-between mt-2 text-xl text-cloud-sky">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setCursor(new Date())}
              className="active:text-mint-green"
            >
              [T] TODAY
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setView(view === "days" ? "years" : "days")}
              className="active:text-mint-green"
            >
              [Y] YEAR
            </button>
            {optional && (
              <button
                type="button"
                tabIndex={-1}
                onClick={clear}
                className="active:text-mint-green"
              >
                [DEL] CLEAR
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
