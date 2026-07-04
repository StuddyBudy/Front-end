"use client";

import type { RepeatConfig } from "../types";
import s from "../Calendar.module.css";

type Props = {
    repeat: RepeatConfig;
    onChange: (r: RepeatConfig) => void;
    onClose: () => void;
    onSave: () => void;
};

export default function RepeatModal({
    repeat,
    onChange,
    onClose,
    onSave,
}: Props) {
    const set = (partial: Partial<RepeatConfig>) =>
        onChange({ ...repeat, ...partial });

    return (
        <div
            className={s.modalOverlay}
            style={{ zIndex: 300 }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={s.repeatModal}>
                <h3 className={s.repeatTitle}>↻ Repeat</h3>

                {/* Repeat every N unit */}
                <div className={s.repeatEveryRow}>
                    <span className={s.repeatEveryLabel}>Repeat every</span>
                    <input
                        type="number"
                        min={1}
                        className={s.repeatNumInput}
                        value={repeat.every}
                        onChange={(e) =>
                            set({
                                every: Math.max(
                                    1,
                                    parseInt(e.target.value) || 1,
                                ),
                            })
                        }
                    />
                    <select
                        className={s.repeatUnitSelect}
                        value={repeat.unit}
                        onChange={(e) =>
                            set({
                                unit: e.target.value as RepeatConfig["unit"],
                            })
                        }
                    >
                        <option value="day">day</option>
                        <option value="week">week</option>
                        <option value="month">month</option>
                        <option value="year">year</option>
                    </select>
                </div>

                {/* Ends */}
                <div className={s.repeatEndsLabel}>Ends</div>
                <div className={s.radioGroup}>
                    {/* Never */}
                    <div
                        className={s.radioRow}
                        onClick={() => set({ endsMode: "never" })}
                    >
                        <div
                            className={`${s.radioCircle} ${repeat.endsMode === "never" ? s.radioCircleFilled : ""}`}
                        />
                        <span className={s.radioLabel}>Never</span>
                    </div>

                    {/* On a specific date */}
                    <div
                        className={s.radioRow}
                        onClick={() => set({ endsMode: "on" })}
                    >
                        <div
                            className={`${s.radioCircle} ${repeat.endsMode === "on" ? s.radioCircleFilled : ""}`}
                        />
                        <span className={s.radioLabel}>On</span>
                        {repeat.endsMode === "on" && (
                            <input
                                type="date"
                                className={s.formInput}
                                style={{ marginLeft: 8, flex: 1 }}
                                value={repeat.endsOn ?? ""}
                                onChange={(e) =>
                                    set({ endsOn: e.target.value })
                                }
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>

                    {/* After N occurrences */}
                    <div
                        className={s.radioRow}
                        onClick={() => set({ endsMode: "occurrences" })}
                    >
                        <div
                            className={`${s.radioCircle} ${repeat.endsMode === "occurrences" ? s.radioCircleFilled : ""}`}
                        />
                        <span className={s.radioLabel}>Occurrences</span>
                        {repeat.endsMode === "occurrences" && (
                            <input
                                type="number"
                                min={1}
                                className={s.repeatNumInput}
                                style={{ marginLeft: 8 }}
                                value={repeat.occurrences ?? 1}
                                onChange={(e) =>
                                    set({
                                        occurrences: Math.max(
                                            1,
                                            parseInt(e.target.value) || 1,
                                        ),
                                    })
                                }
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>
                </div>

                <div className={s.divider} />

                {/* URL */}
                <div className={s.repeatExtraField}>
                    <label className={s.repeatExtraLabel}>URL</label>
                    <input
                        className={s.formInput}
                        placeholder="https://…"
                        value={repeat.url ?? ""}
                        onChange={(e) => set({ url: e.target.value })}
                    />
                </div>

                {/* Description (max 250) */}
                <div className={s.repeatExtraField}>
                    <label className={s.repeatExtraLabel}>Description</label>
                    <textarea
                        className={s.repeatTextarea}
                        placeholder="Add a description…"
                        maxLength={250}
                        value={repeat.description ?? ""}
                        onChange={(e) => set({ description: e.target.value })}
                    />
                    <span className={s.hintText}>
                        {(repeat.description ?? "").length} / 250
                    </span>
                </div>

                <div className={s.modalFooter}>
                    <button className={s.btnCancel} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={s.btnSave} onClick={onSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
