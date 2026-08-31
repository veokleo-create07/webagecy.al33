"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { dayKey, type Slot } from "@/lib/booking";
import styles from "./booking.module.css";

type Props = { slots: Slot[]; timezone: string; selected: Slot | null; onSelect: (slot: Slot | null) => void; disabled: boolean; status?: ReactNode };

export function BookingCalendar({ slots, timezone, selected, onSelect, disabled, status }: Props) {
  const today = dayKey(new Date(), timezone);
  const [month, setMonth] = useState(() => slots[0] ? dayKey(slots[0].startsAt, timezone).slice(0, 7) : today.slice(0, 7));
  const [selectedDay, setSelectedDay] = useState(selected ? dayKey(selected.startsAt, timezone) : "");
  const byDay = useMemo(() => {
    const days = new Map<string, Slot[]>();
    slots.forEach(slot => {
      const key = dayKey(slot.startsAt, timezone);
      days.set(key, [...(days.get(key) ?? []), slot]);
    });
    return days;
  }, [slots, timezone]);

  useEffect(() => {
    // Open the first available day, but leave the time for the visitor to choose.
    if (selectedDay && byDay.has(selectedDay)) return;
    const nextDay = [...byDay.keys()].sort()[0] ?? "";
    setSelectedDay(nextDay);
    if (nextDay) setMonth(nextDay.slice(0, 7));
  }, [byDay, selectedDay]);

  const [year, number] = month.split("-").map(Number);
  const monthDate = new Date(Date.UTC(year, number - 1, 1));
  const offset = (monthDate.getUTCDay() + 6) % 7;
  const length = new Date(Date.UTC(year, number, 0)).getUTCDate();
  const months = [...new Set([today.slice(0, 7), ...slots.map(slot => dayKey(slot.startsAt, timezone).slice(0, 7))])].sort();
  const move = (delta: number) => {
    const next = new Date(Date.UTC(year, number - 1 + delta, 1));
    setMonth(next.toISOString().slice(0, 7));
  };
  const dayLabel = (key: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));
  const timeLabel = (value: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: timezone }).format(new Date(value));

  return (
    <div className={styles.calendar}>
      <div>
        <div className={styles.monthHeader}>
          <button type="button" className={styles.monthControl} aria-label="Previous month" disabled={disabled || month <= months[0]} onClick={() => move(-1)}><Chevron back /></button>
          <p aria-live="polite">{new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(monthDate)}</p>
          <button type="button" className={styles.monthControl} aria-label="Next month" disabled={disabled || month >= months[months.length - 1]} onClick={() => move(1)}><Chevron /></button>
        </div>
        <div className={styles.days} role="group" aria-label="Choose a date">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <span key={i} aria-hidden="true" className={styles.weekday}>{day}</span>)}
          {Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}
          {Array.from({ length }, (_, i) => {
            const key = `${month}-${String(i + 1).padStart(2, "0")}`;
            const available = byDay.has(key);
            return <button key={key} type="button" className={styles.day} disabled={disabled || !available} aria-label={dayLabel(key)} aria-pressed={selectedDay === key} onClick={() => { setSelectedDay(key); onSelect(null); }}>{i + 1}</button>;
          })}
        </div>
      </div>
      <div className={styles.times}>
        <p className={styles.label}>{selectedDay ? dayLabel(selectedDay) : "Available times"}</p>
        {status || (!selectedDay && <p className={styles.hint}>There are no available times to select.</p>)}
        <div className={styles.timeGrid} role="group" aria-label="Choose a time">
          {(byDay.get(selectedDay) ?? []).map(slot => <button type="button" key={slot.id} className={styles.time} disabled={disabled} aria-pressed={selected?.id === slot.id} onClick={() => onSelect(slot)}>{timeLabel(slot.startsAt)}<span>{Math.round((Date.parse(slot.endsAt) - Date.parse(slot.startsAt)) / 60000)} min</span></button>)}
        </div>
      </div>
    </div>
  );
}

function Chevron({ back = false }: { back?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={back ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} /></svg>;
}
