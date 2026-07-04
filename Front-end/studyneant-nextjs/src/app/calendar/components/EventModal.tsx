"use client";

import { useState, useEffect } from "react";
import type { CalEvent, CalCalendar, RepeatConfig } from "../types";
import { EVENT_COLORS } from "../storage";
import RepeatModal from "./RepeatModal";
import s from "../Calendar.module.css";

type Props = {
    event: CalEvent;
    calendars: CalCalendar[];
    isNew: boolean;
    onSave: (e: CalEvent) => void;
    onDelete?: (id: string) => void;
    onClose: () => void;
};

export default function EventModal({
    event,
    calendars,
    isNew,
    onSave,
    onDelete,
    onClose,
}: Props) {
    const [draft, setDraft] = useState<CalEvent>(event);
    const [showRepeat, setShowRepeat] = useState(false);

    // FIX: ESC key closes modal (or the sub-modal if it's open)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (showRepeat) setShowRepeat(false);
            else onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [showRepeat, onClose]);

    const set = (partial: Partial<CalEvent>) =>
        setDraft((prev) => ({ ...prev, ...partial }));
    const setRepeat = (r: RepeatConfig) =>
        setDraft((prev) => ({ ...prev, repeat: r }));

    const handleSave = () => {
        onSave(draft);
        onClose();
    };

    // Close on overlay click only when repeat sub-modal is not open
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (!showRepeat && e.target === e.currentTarget) onClose();
    };

    const resolvedColor =
        draft.color ||
        calendars.find((c) => c.id === draft.calendarId)?.color ||
        "#de8900";

    return (
        <>
            {/* ── BLURRED BACKDROP ── */}
            <div className={s.modalOverlay} onClick={handleOverlayClick}>
                <div className={s.eventModal}>
                    {/* Title input — underline style */}
                    <input
                        autoFocus
                        className={s.modalTitleInput}
                        placeholder="Add title"
                        value={draft.title}
                        onChange={(e) => set({ title: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    />

                    <div className={s.modalBody}>
                        {/* ── START DATE/TIME ── */}
                        <div className={s.fieldRow}>
                            <span className={s.fieldIcon}>🕐</span>
                            <span className={s.fieldLabel}>Starts</span>
                            <div className={s.dateGroup}>
                                <input
                                    type="date"
                                    className={`${s.inputPill} ${s.inputDate}`}
                                    value={draft.startDate}
                                    onChange={(e) =>
                                        set({ startDate: e.target.value })
                                    }
                                />
                                {!draft.allDay && (
                                    <input
                                        type="time"
                                        className={`${s.inputPill} ${s.inputTime}`}
                                        value={draft.startTime}
                                        onChange={(e) =>
                                            set({ startTime: e.target.value })
                                        }
                                    />
                                )}
                            </div>
                        </div>

                        {/* ── END DATE/TIME ── */}
                        <div className={s.fieldRow}>
                            <span className={s.fieldIcon}>🕔</span>
                            <span className={s.fieldLabel}>Ends</span>
                            <div className={s.dateGroup}>
                                <input
                                    type="date"
                                    className={`${s.inputPill} ${s.inputDate}`}
                                    value={draft.endDate}
                                    onChange={(e) =>
                                        set({ endDate: e.target.value })
                                    }
                                />
                                {!draft.allDay && (
                                    <input
                                        type="time"
                                        className={`${s.inputPill} ${s.inputTime}`}
                                        value={draft.endTime}
                                        onChange={(e) =>
                                            set({ endTime: e.target.value })
                                        }
                                    />
                                )}
                            </div>
                        </div>

                        {/* ── ALL DAY ── */}
                        <div className={s.allDayRow2}>
                            <label className={s.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={draft.allDay}
                                    onChange={(e) =>
                                        set({ allDay: e.target.checked })
                                    }
                                />
                                <div className={s.toggleTrack} />
                                <div className={s.toggleThumb} />
                            </label>
                            <span className={s.toggleLabel}>All day</span>
                        </div>

                        <div className={s.divider} />

                        {/* ── CALENDAR ── */}
                        <div className={s.fieldRow}>
                            <span className={s.fieldIcon}>📅</span>
                            <span className={s.fieldLabel}>Calendar</span>
                            <select
                                className={s.selectInput}
                                value={draft.calendarId}
                                onChange={(e) =>
                                    set({ calendarId: e.target.value })
                                }
                            >
                                {calendars.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ── COLOUR TAGS ── */}
                        <div className={s.fieldRow}>
                            <span className={s.fieldIcon}>🎨</span>
                            <span className={s.fieldLabel}>Colour</span>
                            <div className={s.colorPicker}>
                                {/* First swatch = calendar default colour */}
                                <div
                                    className={`${s.colorCircle} ${draft.color === "" ? s.colorCircleActive : ""}`}
                                    style={{ background: resolvedColor }}
                                    onClick={() => set({ color: "" })}
                                    title="Calendar default"
                                />
                                {EVENT_COLORS.map((c) => (
                                    <div
                                        key={c}
                                        className={`${s.colorCircle} ${draft.color === c ? s.colorCircleActive : ""}`}
                                        style={{ background: c }}
                                        onClick={() => set({ color: c })}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── LOCATION ── */}
                        <div className={s.fieldRow}>
                            <span className={s.fieldIcon}>📍</span>
                            <span className={s.fieldLabel}>Location</span>
                            <input
                                className={s.inputFull}
                                placeholder="Add location"
                                value={draft.location}
                                onChange={(e) =>
                                    set({ location: e.target.value })
                                }
                            />
                        </div>

                        <div className={s.divider} />

                        {/* ── TO-DO ── */}
                        <div className={s.todoSection}>
                            <div className={s.todoExpandRow}>
                                <label className={s.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        checked={draft.isTodo}
                                        onChange={(e) =>
                                            set({ isTodo: e.target.checked })
                                        }
                                    />
                                    <div className={s.toggleTrack} />
                                    <div className={s.toggleThumb} />
                                </label>
                                <span className={s.toggleLabel}>
                                    Add to To-Do list
                                </span>
                            </div>
                        </div>

                        {/* ── ADVANCED ── */}
                        <div>
                            <button
                                className={`${s.advancedBtn} ${draft.repeat.enabled ? s.advancedBtnActive : ""}`}
                                onClick={() => setShowRepeat(true)}
                            >
                                ↻ Advanced (repeat, URL, description)
                                {draft.repeat.enabled && " ●"}
                            </button>
                        </div>

                        {/* ── FOOTER ── */}
                        <div className={s.modalFooter}>
                            {!isNew && onDelete && (
                                <button
                                    style={{
                                        padding: "7px 14px",
                                        border: "1px solid rgba(224,85,85,0.3)",
                                        borderRadius: 8,
                                        background: "rgba(224,85,85,0.10)",
                                        color: "#e05555",
                                        fontFamily: "var(--font-body)",
                                        fontSize: ".80rem",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        onDelete(draft.id);
                                        onClose();
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                            <div className={s.footerSep} />
                            <button className={s.cancelBtn} onClick={onClose}>
                                Cancel
                            </button>
                            <button className={s.saveBtn} onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── REPEAT SUB-MODAL stacks on top ── */}
            {showRepeat && (
                <RepeatModal
                    repeat={draft.repeat}
                    onChange={setRepeat}
                    onClose={() => setShowRepeat(false)}
                    onSave={() => {
                        setRepeat({ ...draft.repeat, enabled: true });
                        setShowRepeat(false);
                    }}
                />
            )}
        </>
    );
}
