"use client";

import { useState } from "react";
import type { ThemeDef } from "../types";
import s from "../Dashboard.module.css";

// ── THEME PREVIEW ─────────────────────────────────────────────────────────────
function ThemePreview({ theme }: { theme: ThemeDef }) {
    const bg = theme.vars["--dash-bg-page"];
    const wig = theme.vars["--dash-bg-widget"];
    const acc = theme.vars["--dash-accent-warm"];
    return (
        <div className={s.tpCanvas} style={{ background: bg }}>
            <div
                className={s.tpWidget}
                style={{ background: wig, borderColor: acc + "40" }}
            >
                <div className={s.tpBar} style={{ background: acc }} />
                <div className={s.tpLine} style={{ background: acc + "50" }} />
                <div
                    className={s.tpLine}
                    style={{ background: acc + "28", width: "55%" }}
                />
            </div>
            <div
                className={`${s.tpWidget} ${s.tpWidgetSmall}`}
                style={{ background: wig, borderColor: acc + "40" }}
            >
                <div
                    className={s.tpBar}
                    style={{ background: acc, width: "60%" }}
                />
                <div className={s.tpLine} style={{ background: acc + "50" }} />
            </div>
        </div>
    );
}

// ── BUILDER FIELDS ────────────────────────────────────────────────────────────
const BUILDER_FIELDS = [
    { key: "name", label: "Name", type: "text", placeholder: "My Theme" },
    { key: "label", label: "Emoji", type: "text", placeholder: "🎨" },
    { key: "bgPage", label: "Page BG", type: "color", placeholder: "" },
    { key: "bgWidget", label: "Widget BG", type: "color", placeholder: "" },
    { key: "accent", label: "Accent", type: "color", placeholder: "" },
    { key: "accentWarm", label: "Highlight", type: "color", placeholder: "" },
    { key: "textPrimary", label: "Text", type: "color", placeholder: "" },
] as const;

type DraftKey = (typeof BUILDER_FIELDS)[number]["key"];

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = {
    allThemes: Record<string, ThemeDef>;
    activeThemeId: string;
    customThemeIds: string[];
    onThemeChange: (id: string) => void;
    onAddTheme: (t: ThemeDef) => void;
    onDeleteTheme: (id: string) => void;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function SettingsView({
    allThemes,
    activeThemeId,
    customThemeIds,
    onThemeChange,
    onAddTheme,
    onDeleteTheme,
}: Props) {
    const [creating, setCreating] = useState(false);
    const [draft, setDraft] = useState<Record<DraftKey, string>>({
        name: "",
        label: "🎨",
        bgPage: "#16120e",
        bgWidget: "#1e1810",
        accent: "#dfd0b8",
        accentWarm: "#de8900",
        textPrimary: "#f0e8d8",
    });

    const setField = (k: DraftKey, v: string) =>
        setDraft((p) => ({ ...p, [k]: v }));

    const handleCreate = () => {
        const id = `custom_${Date.now()}`;
        onAddTheme({
            id,
            name: draft.name || "Custom",
            label: draft.label || "🎨",
            vars: {
                "--dash-bg-page": draft.bgPage,
                "--dash-bg-widget": draft.bgWidget + "ee",
                "--dash-bg-handle": draft.bgWidget,
                "--dash-accent": draft.accent,
                "--dash-accent-warm": draft.accentWarm,
                "--dash-accent-glow": draft.accentWarm + "38",
                "--dash-text-primary": draft.textPrimary,
                "--dash-text-muted": draft.textPrimary + "70",
                "--dash-border": draft.accent + "1a",
                "--dash-border-hover": draft.accent + "40",
            },
        });
        setCreating(false);
    };

    return (
        <div className={s.settingsPage}>
            {/* ── APPEARANCE ── */}
            <section className={s.settingsSec}>
                <h2 className={s.settingsH2}>Appearance</h2>
                <p className={s.settingsP}>
                    Select a theme for your dashboard. Your choice is saved
                    automatically.
                </p>

                <div className={s.themeGrid}>
                    {Object.values(allThemes).map((t) => (
                        <button
                            key={t.id}
                            className={`${s.themeCard} ${activeThemeId === t.id ? s.themeCardActive : ""}`}
                            onClick={() => onThemeChange(t.id)}
                        >
                            <ThemePreview theme={t} />
                            <div className={s.tcFooter}>
                                <span className={s.tcEmoji}>{t.label}</span>
                                <span className={s.tcName}>{t.name}</span>
                                {customThemeIds.includes(t.id) && (
                                    <span
                                        className={s.tcDel}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteTheme(t.id);
                                        }}
                                        title="Delete"
                                    >
                                        ✕
                                    </span>
                                )}
                            </div>
                            {activeThemeId === t.id && (
                                <span className={s.tcCheck}>✓</span>
                            )}
                        </button>
                    ))}

                    <button
                        className={`${s.themeCard} ${s.themeAddCard}`}
                        onClick={() => setCreating((c) => !c)}
                    >
                        <div className={s.tcAddIcon}>+</div>
                        <div className={s.tcFooter}>
                            <span className={s.tcName}>New Theme</span>
                        </div>
                    </button>
                </div>

                {creating && (
                    <div className={s.themeBuilder}>
                        <h3 className={s.builderH3}>Create Custom Theme</h3>
                        <div className={s.builderFields}>
                            {BUILDER_FIELDS.map(
                                ({ key, label, type, placeholder }) => (
                                    <label key={key} className={s.builderField}>
                                        <span>{label}</span>
                                        <div className={s.builderInputRow}>
                                            {type === "color" && (
                                                <input
                                                    type="color"
                                                    className={s.colorSwatch}
                                                    value={draft[key]}
                                                    onChange={(e) =>
                                                        setField(
                                                            key,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                placeholder={placeholder}
                                                value={draft[key]}
                                                onChange={(e) =>
                                                    setField(
                                                        key,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>
                                ),
                            )}
                        </div>
                        <div className={s.builderBtns}>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnPrimary}`}
                                onClick={handleCreate}
                            >
                                Create Theme
                            </button>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnGhost}`}
                                onClick={() => setCreating(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* ── LAYOUT INFO ── */}
            <section className={s.settingsSec}>
                <h2 className={s.settingsH2}>Dashboard Layout</h2>
                <p className={s.settingsP}>
                    Click{" "}
                    <strong style={{ color: "var(--dash-accent-warm)" }}>
                        Edit Dashboard
                    </strong>{" "}
                    in the top bar to drag and resize widgets. Your layout is
                    saved automatically when you click Save Layout.
                </p>
            </section>
        </div>
    );
}
