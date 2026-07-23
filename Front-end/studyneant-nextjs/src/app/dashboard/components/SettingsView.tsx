"use client";

import { useEffect, useMemo, useState } from "react";
import type { ThemeDef } from "../types";
import { createStorageStore, useStorageStore } from "@/hooks/storageStore";
import s from "../Dashboard.module.css";

const SETTINGS_DISPLAY_KEY = "studyos_settings_display_mode";

type SettingsDisplay = "left" | "center" | "right";

// Panel-position preference, read via useSyncExternalStore: prerender and
// hydration see "center", the saved value arrives right after hydration, and
// the setter persists automatically.
const settingsDisplayStore = createStorageStore<SettingsDisplay>({
    load: () => {
        const saved = window.localStorage.getItem(SETTINGS_DISPLAY_KEY);
        return saved === "left" || saved === "center" || saved === "right"
            ? saved
            : "center";
    },
    persist: (v) => {
        try {
            window.localStorage.setItem(SETTINGS_DISPLAY_KEY, v);
        } catch {}
    },
    server: "center",
});

type GradientPos = "center" | "left" | "right" | "bottom-left" | "top-right";

type BuilderDraft = {
    name: string;
    label: string;
    bgPage: string;
    bgWidget: string;
    topbarBg: string;
    bottomnavBg: string;
    sidebarBg: string;
    btnText: string;
    navHoverBg: string;
    accent: string;
    accentWarm: string;
    accentGlow: string;
    textPrimary: string;
    border: string;
    borderHover: string;
};

type Props = {
    allThemes: Record<string, ThemeDef>;
    activeThemeId: string;
    editableThemeIds: string[];
    canCreateTheme: boolean;
    themeLimit: number;
    onThemeChange: (id: string) => void;
    onAddTheme: (t: ThemeDef) => void;
    onDeleteTheme: (id: string) => void;
    onUpdateTheme: (
        id: string,
        patch: Partial<Pick<ThemeDef, "name" | "label" | "vars">>,
    ) => void;
    onResetSettings: () => void;
};

const BASE_EMOJIS = ["🎨", "🔥", "🌙", "🌿", "💡", "🌊", "🧊", "🌅"];

const DEFAULT_DRAFT: BuilderDraft = {
    name: "",
    label: "",
    bgPage: "#16120e",
    bgWidget: "#1e1810",
    topbarBg: "#000000",
    bottomnavBg: "#000000",
    sidebarBg: "#1e1810",
    btnText: "#111111",
    navHoverBg: "#ffffff",
    accent: "#dfd0b8",
    accentWarm: "#de8900",
    accentGlow: "#de8900",
    textPrimary: "#f0e8d8",
    border: "#dfd0b8",
    borderHover: "#dfd0b8",
};

const HELP_ITEMS = [
    ["Name", "How this theme appears in your list."],
    ["Emoji", "Optional icon for quick scanning. You can also choose none."],
    ["Page Background", "Main page color behind all content."],
    ["Primary Text", "Main readable text color."],
    ["Widget Background", "Card and widget surface color."],
    [
        "Top Bar bg",
        "Top navigation bar background. Transparent lets the page gradient show through.",
    ],
    [
        "Bottom Nav bg",
        "Bottom navigation bar background. Transparent lets the page gradient show through.",
    ],
    ["Sidebar bg", "Slide-out navigation drawer background."],
    [
        "Button Text",
        "Text/icon color on filled accent buttons (Save, +, badges).",
    ],
    ["Nav Hover", "Highlight shown when hovering nav items and ghost buttons."],
    ["Accent", "Secondary text and decorative accents."],
    ["Highlight", "Important action and emphasis color."],
    ["Accent Glow", "Glow/shadow tint around active UI."],
    ["Border", "Default border color across cards/inputs."],
    ["Border Hover", "Border color used for hover/focus."],
    [
        "Gradient Position",
        "Choose where the gradient focus appears when radical background is on.",
    ],
] as const;

function ThemePreview({ theme }: { theme: ThemeDef }) {
    const bg = theme.vars["--dash-bg-page"];
    const bgImage = theme.vars["--dash-bg-image"] || "none";
    const wig = theme.vars["--dash-bg-widget"];
    const acc = theme.vars["--dash-accent-warm"];

    return (
        <div
            className={s.tpCanvas}
            style={{ background: bg, backgroundImage: bgImage }}
        >
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

function asHex(value: string | undefined, fallback: string): string {
    if (!value) return fallback;
    const trimmed = value.trim();
    return /^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(trimmed)
        ? trimmed.slice(0, 7)
        : fallback;
}

function parseRgbString(value: string): [number, number, number] | null {
    const match = value
        .trim()
        .match(
            /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i,
        );
    if (!match) return null;
    const r = Number.parseInt(match[1], 10);
    const g = Number.parseInt(match[2], 10);
    const b = Number.parseInt(match[3], 10);
    if ([r, g, b].some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
        return null;
    }
    return [r, g, b];
}

function toHexFromToken(value: string | undefined, fallback: string): string {
    if (!value) return fallback;
    const hex = asHex(value, "");
    if (hex) return hex;
    const rgb = parseRgbString(value);
    if (!rgb) return fallback;
    const to2 = (n: number) => n.toString(16).padStart(2, "0");
    return `#${to2(rgb[0])}${to2(rgb[1])}${to2(rgb[2])}`;
}

function withAlpha(hex: string, suffix: string): string {
    return /^#([\da-f]{3}|[\da-f]{6})$/i.test(hex) ? `${hex}${suffix}` : hex;
}

// A navbar token counts as "transparent" when it's unset or the literal
// keyword — used to restore the transparent-checkbox state when editing.
function isTransparentToken(value: string | undefined): boolean {
    return !value || value.trim().toLowerCase() === "transparent";
}

function rgbaFromHex(hex: string, alpha: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return `rgba(255,255,255,${alpha})`;
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function gradientImage(
    position: GradientPos,
    bgPage: string,
    accentWarm: string,
): string {
    const map: Record<
        GradientPos,
        { x: string; y: string; ox: string; oy: string }
    > = {
        center: { x: "50%", y: "50%", ox: "82%", oy: "8%" },
        left: { x: "18%", y: "50%", ox: "84%", oy: "10%" },
        right: { x: "82%", y: "50%", ox: "16%", oy: "10%" },
        "bottom-left": { x: "18%", y: "82%", ox: "82%", oy: "12%" },
        "top-right": { x: "82%", y: "18%", ox: "18%", oy: "82%" },
    };

    const pos = map[position];
    // 0.52 (vs the usual 0.5) biases mid-tone page backgrounds toward the
    // light treatment, which looked better in practice for the glow colors.
    const isDark = luminance(bgPage) < 0.52;
    const glowColor = isDark
        ? rgbaFromHex(accentWarm, 0.2)
        : "rgba(120,120,120,0.16)";
    const shadowColor = isDark ? "rgba(0,0,0,0.5)" : "rgba(120,120,120,0.16)";
    const edgeColor = isDark ? "rgba(0,0,0,0.42)" : "rgba(90,90,90,0.12)";

    return `radial-gradient(circle at ${pos.x} ${pos.y}, ${glowColor}, transparent 44%), radial-gradient(circle at ${pos.ox} ${pos.oy}, ${shadowColor}, transparent 40%), radial-gradient(ellipse at center, transparent 58%, ${edgeColor} 100%)`;
}

function buildVars(
    draft: BuilderDraft,
    radicalBg: boolean,
    gradientPos: GradientPos,
    topbarTransparent: boolean,
    bottomnavTransparent: boolean,
): Record<string, string> {
    // The two-digit suffixes are hex alpha channels appended to the solid
    // draft colors (ee≈93%, 70≈44%, 47≈28%, 40≈25%, 38≈22%, 17≈9%, 1a≈10%) —
    // they set each token's translucency without needing separate draft fields.
    return {
        "--dash-bg-page": draft.bgPage,
        "--dash-bg-widget": withAlpha(draft.bgWidget, "ee"),
        "--dash-bg-handle": draft.bgWidget,
        // Navbars default to transparent so the page gradient bleeds through;
        // a chosen color is applied at ~28% alpha to keep the blur legible.
        "--dash-topbar-bg": topbarTransparent
            ? "transparent"
            : withAlpha(draft.topbarBg, "47"),
        "--dash-bottomnav-bg": bottomnavTransparent
            ? "transparent"
            : withAlpha(draft.bottomnavBg, "47"),
        "--dash-bg-sidebar": draft.sidebarBg,
        "--dash-btn-text": draft.btnText,
        "--dash-nav-hover-bg": withAlpha(draft.navHoverBg, "17"),
        "--dash-accent": draft.accent,
        "--dash-accent-warm": draft.accentWarm,
        "--dash-accent-glow": withAlpha(draft.accentGlow, "38"),
        "--dash-text-primary": draft.textPrimary,
        "--dash-text-muted": withAlpha(draft.textPrimary, "70"),
        "--dash-border": withAlpha(draft.border, "1a"),
        "--dash-border-hover": withAlpha(draft.borderHover, "40"),
        "--dash-bg-image": radicalBg
            ? gradientImage(gradientPos, draft.bgPage, draft.accentWarm)
            : "none",
    };
}

function initDraft(theme: ThemeDef): BuilderDraft {
    return {
        name: theme.name,
        label: theme.label || "",
        bgPage: toHexFromToken(
            theme.vars["--dash-bg-page"],
            DEFAULT_DRAFT.bgPage,
        ),
        bgWidget: toHexFromToken(
            theme.vars["--dash-bg-widget"],
            DEFAULT_DRAFT.bgWidget,
        ),
        // ?? --dash-navbars-bg migrates themes saved before the nav split.
        topbarBg: toHexFromToken(
            theme.vars["--dash-topbar-bg"] ?? theme.vars["--dash-navbars-bg"],
            DEFAULT_DRAFT.topbarBg,
        ),
        bottomnavBg: toHexFromToken(
            theme.vars["--dash-bottomnav-bg"] ??
                theme.vars["--dash-navbars-bg"],
            DEFAULT_DRAFT.bottomnavBg,
        ),
        sidebarBg: toHexFromToken(
            theme.vars["--dash-bg-sidebar"] ?? theme.vars["--dash-bg-widget"],
            DEFAULT_DRAFT.sidebarBg,
        ),
        btnText: toHexFromToken(
            theme.vars["--dash-btn-text"],
            DEFAULT_DRAFT.btnText,
        ),
        navHoverBg: toHexFromToken(
            theme.vars["--dash-nav-hover-bg"],
            DEFAULT_DRAFT.navHoverBg,
        ),
        accent: toHexFromToken(
            theme.vars["--dash-accent"],
            DEFAULT_DRAFT.accent,
        ),
        accentWarm: toHexFromToken(
            theme.vars["--dash-accent-warm"],
            DEFAULT_DRAFT.accentWarm,
        ),
        accentGlow: toHexFromToken(
            theme.vars["--dash-accent-glow"],
            DEFAULT_DRAFT.accentGlow,
        ),
        textPrimary: toHexFromToken(
            theme.vars["--dash-text-primary"],
            DEFAULT_DRAFT.textPrimary,
        ),
        border: toHexFromToken(
            theme.vars["--dash-border"],
            DEFAULT_DRAFT.border,
        ),
        borderHover: toHexFromToken(
            theme.vars["--dash-border-hover"],
            DEFAULT_DRAFT.borderHover,
        ),
    };
}

/**
 * Reverse of gradientImage(): recovers the GradientPos preset from a saved
 * --dash-bg-image value by matching the "circle at X% Y%" coordinate pairs
 * that gradientImage() (and older theme presets) bake into the string.
 * Must stay in sync with the coordinate map in gradientImage().
 */
function inferGradientPos(bgImage: string | undefined): GradientPos {
    if (!bgImage || bgImage === "none") return "center";
    if (bgImage.includes("18% 82%") || bgImage.includes("14% 84%"))
        return "bottom-left";
    if (bgImage.includes("82% 18%") || bgImage.includes("86% 12%"))
        return "top-right";
    if (bgImage.includes("18% 50%") || bgImage.includes("16% 40%"))
        return "left";
    if (bgImage.includes("82% 50%") || bgImage.includes("84% 40%"))
        return "right";
    return "center";
}

function isLikelyEmoji(input: string): boolean {
    const value = input.trim();
    if (!value) return false;
    if (/[a-z0-9]/i.test(value)) return false;
    return /\p{Extended_Pictographic}/u.test(value);
}

function hexToRgb(hex: string): [number, number, number] | null {
    const clean = hex.replace("#", "").trim();
    if (!/^[\da-f]{6}$/i.test(clean)) return null;
    return [
        Number.parseInt(clean.slice(0, 2), 16),
        Number.parseInt(clean.slice(2, 4), 16),
        Number.parseInt(clean.slice(4, 6), 16),
    ];
}

function rgbToHex(r: number, g: number, b: number): string {
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
    const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Linear RGB blend of two hex colors; weight 0 → all `a`, 1 → all `b`. */
function mixHex(a: string, b: string, weight: number): string {
    const ar = hexToRgb(a);
    const br = hexToRgb(b);
    if (!ar || !br) return a;
    const mix = Math.max(0, Math.min(1, weight));
    return rgbToHex(
        ar[0] * (1 - mix) + br[0] * mix,
        ar[1] * (1 - mix) + br[1] * mix,
        ar[2] * (1 - mix) + br[2] * mix,
    );
}

/**
 * Approximate perceived brightness (0–1) using Rec. 709 weights on raw
 * 0–255 channels — deliberately skips sRGB linearization since it's only
 * used for coarse dark-vs-light decisions, not contrast math.
 */
function luminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0.5;
    const [r, g, b] = rgb.map((v) => v / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function deriveSimpleDraft(draft: BuilderDraft): BuilderDraft {
    const bg = asHex(draft.bgPage, DEFAULT_DRAFT.bgPage);
    const text = asHex(draft.textPrimary, DEFAULT_DRAFT.textPrimary);
    const darkBase = luminance(bg) < 0.5;
    const widget = mixHex(bg, text, darkBase ? 0.12 : 0.08);
    const accent = mixHex(text, bg, darkBase ? 0.22 : 0.18);
    const warmBase = darkBase ? "#7fa7ff" : "#b86a00";
    const warm = mixHex(accent, warmBase, 0.42);
    const glow = mixHex(warm, bg, 0.55);
    const border = mixHex(text, bg, 0.72);
    const borderHover = mixHex(text, bg, 0.58);
    const navBarsBg = darkBase ? "#000000" : "#ffffff";
    // Accent buttons need dark text on light accents and light text on dark.
    const btnText = luminance(warm) > 0.6 ? "#111111" : "#ffffff";

    return {
        ...draft,
        bgWidget: widget,
        topbarBg: navBarsBg,
        bottomnavBg: navBarsBg,
        sidebarBg: widget,
        btnText,
        navHoverBg: text,
        accent,
        accentWarm: warm,
        accentGlow: glow,
        border,
        borderHover,
    };
}

export default function SettingsView({
    allThemes,
    activeThemeId,
    editableThemeIds,
    canCreateTheme,
    themeLimit,
    onThemeChange,
    onAddTheme,
    onDeleteTheme,
    onUpdateTheme,
    onResetSettings,
}: Props) {
    const [settingsDisplay, setSettingsDisplay] = useStorageStore(
        settingsDisplayStore,
    );
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
    const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
    const [helpOpen, setHelpOpen] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [radicalBg, setRadicalBg] = useState(true);
    const [topbarTransparent, setTopbarTransparent] = useState(true);
    const [bottomnavTransparent, setBottomnavTransparent] = useState(true);
    const [gradientPos, setGradientPos] = useState<GradientPos>("center");
    const [draft, setDraft] = useState<BuilderDraft>(DEFAULT_DRAFT);
    const [customEmojis, setCustomEmojis] = useState<string[]>([]);
    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [emojiModalOpen, setEmojiModalOpen] = useState(false);
    const [emojiInput, setEmojiInput] = useState("");
    const [emojiError, setEmojiError] = useState("");

    const [contextMenu, setContextMenu] = useState<{
        themeId: string;
        x: number;
        y: number;
    } | null>(null);

    const contextTheme = useMemo(
        () => (contextMenu ? allThemes[contextMenu.themeId] : null),
        [contextMenu, allThemes],
    );

    const emojiChoices = useMemo(
        () => [
            "",
            ...BASE_EMOJIS,
            ...customEmojis.filter((e) => !BASE_EMOJIS.includes(e)),
        ],
        [customEmojis],
    );

    const handleCancelEditor = () => {
        setEditorOpen(false);
        setHelpOpen(false);
        setContextMenu(null);
    };

    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (helpOpen) {
                setHelpOpen(false);
                return;
            }
            if (limitModalOpen) {
                setLimitModalOpen(false);
                return;
            }
            if (emojiModalOpen) {
                setEmojiModalOpen(false);
                setEmojiError("");
                return;
            }
            if (editorOpen) {
                handleCancelEditor();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [editorOpen, helpOpen, limitModalOpen, emojiModalOpen]);

    const setField = (key: keyof BuilderDraft, value: string) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    const openCreate = () => {
        if (!canCreateTheme) {
            setLimitModalOpen(true);
            return;
        }

        setEditorMode("create");
        setEditingThemeId(null);
        setDraft(DEFAULT_DRAFT);
        setAdvancedOpen(false);
        setRadicalBg(true);
        setTopbarTransparent(true);
        setBottomnavTransparent(true);
        setGradientPos("center");
        setEditorOpen(true);
    };

    const openEdit = (themeId: string) => {
        const theme = allThemes[themeId];
        if (!theme) return;

        onThemeChange(themeId);
        setEditorMode("edit");
        setEditingThemeId(themeId);
        setDraft(initDraft(theme));
        setAdvancedOpen(false);
        setRadicalBg(theme.vars["--dash-bg-image"] !== "none");
        setTopbarTransparent(
            isTransparentToken(
                theme.vars["--dash-topbar-bg"] ??
                    theme.vars["--dash-navbars-bg"],
            ),
        );
        setBottomnavTransparent(
            isTransparentToken(
                theme.vars["--dash-bottomnav-bg"] ??
                    theme.vars["--dash-navbars-bg"],
            ),
        );
        setGradientPos(inferGradientPos(theme.vars["--dash-bg-image"]));
        setEditorOpen(true);
        setContextMenu(null);
    };

    const handleDuplicateTheme = () => {
        if (!contextTheme) return;
        if (!canCreateTheme) {
            setContextMenu(null);
            setLimitModalOpen(true);
            return;
        }

        onAddTheme({
            ...contextTheme,
            id: `custom_${Date.now()}`,
            name: `${contextTheme.name} Copy`,
        });
        setContextMenu(null);
    };

    const handleSubmit = () => {
        const nextDraft = advancedOpen ? draft : deriveSimpleDraft(draft);
        const useRadical = advancedOpen ? radicalBg : true;
        // Simple mode always keeps both navbars transparent (gradient shows).
        const useTopbarTransparent = advancedOpen ? topbarTransparent : true;
        const useBottomnavTransparent = advancedOpen
            ? bottomnavTransparent
            : true;
        const vars = buildVars(
            nextDraft,
            useRadical,
            gradientPos,
            useTopbarTransparent,
            useBottomnavTransparent,
        );

        if (editorMode === "create") {
            onAddTheme({
                id: `custom_${Date.now()}`,
                name: nextDraft.name || "Custom",
                label: nextDraft.label,
                vars,
            });
        } else if (editingThemeId) {
            onUpdateTheme(editingThemeId, {
                name: nextDraft.name,
                label: nextDraft.label,
                vars,
            });
        }

        setEditorOpen(false);
    };

    const openThemeMenu = (
        e: React.MouseEvent<HTMLButtonElement>,
        themeId: string,
    ) => {
        if (!editableThemeIds.includes(themeId)) return;
        e.preventDefault();
        setContextMenu({ themeId, x: e.clientX, y: e.clientY });
    };

    const addCustomEmoji = () => {
        setEmojiInput("");
        setEmojiError("");
        setEmojiModalOpen(true);
    };

    const saveCustomEmoji = () => {
        const value = emojiInput.trim();
        if (!value) {
            setEmojiError("Enter an emoji.");
            return;
        }
        if (!isLikelyEmoji(value)) {
            setEmojiError("Use emoji only (no letters or numbers).");
            return;
        }
        setCustomEmojis((prev) =>
            prev.includes(value) ? prev : [...prev, value],
        );
        setField("label", value);
        setEmojiModalOpen(false);
        setEmojiError("");
    };

    const settingsDisplayClass =
        settingsDisplay === "left"
            ? s.settingsPageLeft
            : settingsDisplay === "right"
              ? s.settingsPageRight
              : s.settingsPageCenter;

    return (
        <div className={`${s.settingsPage} ${settingsDisplayClass}`}>
            <section>
                <h2 className={s.settingsH2}>Appearance</h2>
                <div className={s.sectionRule} />
                <p className={s.settingsP}>
                    Select a theme for your dashboard. Your choice is saved
                    automatically.
                </p>

                <div className={s.themeRail}>
                    {Object.values(allThemes).map((theme) => (
                        <button
                            key={theme.id}
                            className={`${s.themeCard} ${activeThemeId === theme.id ? s.themeCardActive : ""}`}
                            onClick={() => onThemeChange(theme.id)}
                            onContextMenu={(e) => openThemeMenu(e, theme.id)}
                            title="Right click for options"
                        >
                            <ThemePreview theme={theme} />
                            <div className={s.tcFooter}>
                                {theme.label ? (
                                    <span className={s.tcEmoji}>
                                        {theme.label}
                                    </span>
                                ) : null}
                                <span className={s.tcName}>{theme.name}</span>
                                <span className={s.tcHint}>⋯</span>
                            </div>
                            {activeThemeId === theme.id ? (
                                <span className={s.tcCheck}>✓</span>
                            ) : null}
                        </button>
                    ))}

                    <button
                        className={`${s.themeCard} ${s.themeAddCard}`}
                        onClick={openCreate}
                        disabled={!canCreateTheme}
                        title={
                            canCreateTheme
                                ? "Create a new theme"
                                : `Theme limit reached (${themeLimit})`
                        }
                    >
                        <div className={s.tcAddIcon}>+</div>
                        <div className={s.tcFooter}>
                            <span className={s.tcName}>New Theme</span>
                        </div>
                    </button>
                </div>

                {editorOpen ? (
                    <div className={s.themeBuilder}>
                        <h3 className={s.builderH3}>
                            {editorMode === "create"
                                ? "Create Theme"
                                : "Edit Theme"}
                        </h3>
                        <div className={s.sectionRule} />

                        <div className={s.builderTopRow}>
                            <button
                                className={`${s.bldBtn} ${advancedOpen ? s.bldBtnPrimary : s.bldBtnGhost}`}
                                onClick={() => setAdvancedOpen((v) => !v)}
                            >
                                {advancedOpen ? "Advanced On" : "Advanced"}
                            </button>
                        </div>

                        <div className={s.builderFields}>
                            <label className={s.builderField}>
                                <span className={s.builderLabelTitle}>
                                    Name
                                </span>
                                <div className={s.builderInputRow}>
                                    <input
                                        className={s.builderInput}
                                        type="text"
                                        placeholder="My Theme"
                                        value={draft.name}
                                        onChange={(e) =>
                                            setField("name", e.target.value)
                                        }
                                    />
                                </div>
                            </label>

                            <label className={s.builderField}>
                                <span className={s.builderLabelTitle}>
                                    Emoji
                                </span>
                                <div className={s.emojiPickerWrap}>
                                    <input
                                        className={s.builderInput}
                                        type="text"
                                        value={draft.label || "none"}
                                        readOnly
                                    />
                                    <div className={s.emojiPicker}>
                                        {emojiChoices.map((emoji) => (
                                            <button
                                                type="button"
                                                key={emoji || "none"}
                                                className={`${s.emojiBtn} ${emoji === "" ? s.emojiNoneBtn : ""} ${draft.label === emoji ? s.emojiBtnActive : ""}`}
                                                onClick={() =>
                                                    setField("label", emoji)
                                                }
                                            >
                                                {emoji || "none"}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            className={`${s.emojiBtn} ${s.emojiAddBtn}`}
                                            onClick={addCustomEmoji}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </label>

                            <label className={s.builderField}>
                                <span className={s.builderLabelTitle}>
                                    Page Background
                                </span>
                                <div className={s.builderInputRow}>
                                    <input
                                        type="color"
                                        className={s.colorSwatch}
                                        value={draft.bgPage}
                                        onChange={(e) =>
                                            setField("bgPage", e.target.value)
                                        }
                                    />
                                    <input
                                        className={s.builderInput}
                                        type="text"
                                        value={draft.bgPage}
                                        onChange={(e) =>
                                            setField("bgPage", e.target.value)
                                        }
                                    />
                                </div>
                            </label>

                            <label className={s.builderField}>
                                <span className={s.builderLabelTitle}>
                                    Primary Text
                                </span>
                                <div className={s.builderInputRow}>
                                    <input
                                        type="color"
                                        className={s.colorSwatch}
                                        value={draft.textPrimary}
                                        onChange={(e) =>
                                            setField(
                                                "textPrimary",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <input
                                        className={s.builderInput}
                                        type="text"
                                        value={draft.textPrimary}
                                        onChange={(e) =>
                                            setField(
                                                "textPrimary",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </label>

                            {advancedOpen ? (
                                <>
                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Widget Background
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.bgWidget}
                                                onChange={(e) =>
                                                    setField(
                                                        "bgWidget",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.bgWidget}
                                                onChange={(e) =>
                                                    setField(
                                                        "bgWidget",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Top Bar bg
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.topbarBg}
                                                disabled={topbarTransparent}
                                                onChange={(e) =>
                                                    setField(
                                                        "topbarBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={
                                                    topbarTransparent
                                                        ? "transparent"
                                                        : draft.topbarBg
                                                }
                                                disabled={topbarTransparent}
                                                onChange={(e) =>
                                                    setField(
                                                        "topbarBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderCheck}>
                                        <input
                                            type="checkbox"
                                            checked={topbarTransparent}
                                            onChange={(e) =>
                                                setTopbarTransparent(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span>Top bar transparent</span>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Bottom Nav bg
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.bottomnavBg}
                                                disabled={bottomnavTransparent}
                                                onChange={(e) =>
                                                    setField(
                                                        "bottomnavBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={
                                                    bottomnavTransparent
                                                        ? "transparent"
                                                        : draft.bottomnavBg
                                                }
                                                disabled={bottomnavTransparent}
                                                onChange={(e) =>
                                                    setField(
                                                        "bottomnavBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderCheck}>
                                        <input
                                            type="checkbox"
                                            checked={bottomnavTransparent}
                                            onChange={(e) =>
                                                setBottomnavTransparent(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span>Bottom nav transparent</span>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Sidebar bg
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.sidebarBg}
                                                onChange={(e) =>
                                                    setField(
                                                        "sidebarBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.sidebarBg}
                                                onChange={(e) =>
                                                    setField(
                                                        "sidebarBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Button Text
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.btnText}
                                                onChange={(e) =>
                                                    setField(
                                                        "btnText",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.btnText}
                                                onChange={(e) =>
                                                    setField(
                                                        "btnText",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Nav Hover
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.navHoverBg}
                                                onChange={(e) =>
                                                    setField(
                                                        "navHoverBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.navHoverBg}
                                                onChange={(e) =>
                                                    setField(
                                                        "navHoverBg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Accent
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.accent}
                                                onChange={(e) =>
                                                    setField(
                                                        "accent",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.accent}
                                                onChange={(e) =>
                                                    setField(
                                                        "accent",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Highlight
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.accentWarm}
                                                onChange={(e) =>
                                                    setField(
                                                        "accentWarm",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.accentWarm}
                                                onChange={(e) =>
                                                    setField(
                                                        "accentWarm",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Accent Glow
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.accentGlow}
                                                onChange={(e) =>
                                                    setField(
                                                        "accentGlow",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.accentGlow}
                                                onChange={(e) =>
                                                    setField(
                                                        "accentGlow",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Border
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.border}
                                                onChange={(e) =>
                                                    setField(
                                                        "border",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.border}
                                                onChange={(e) =>
                                                    setField(
                                                        "border",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label className={s.builderField}>
                                        <span className={s.builderLabelTitle}>
                                            Border Hover
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <input
                                                type="color"
                                                className={s.colorSwatch}
                                                value={draft.borderHover}
                                                onChange={(e) =>
                                                    setField(
                                                        "borderHover",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <input
                                                className={s.builderInput}
                                                type="text"
                                                value={draft.borderHover}
                                                onChange={(e) =>
                                                    setField(
                                                        "borderHover",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <label
                                        className={`${s.builderField} ${s.builderFieldWide}`}
                                    >
                                        <span className={s.builderLabelTitle}>
                                            Gradient Position
                                        </span>
                                        <div className={s.builderInputRow}>
                                            <select
                                                className={`${s.builderInput} ${s.builderSelect}`}
                                                value={gradientPos}
                                                onChange={(e) =>
                                                    setGradientPos(
                                                        e.target
                                                            .value as GradientPos,
                                                    )
                                                }
                                                disabled={!radicalBg}
                                            >
                                                <option value="center">
                                                    Center
                                                </option>
                                                <option value="left">
                                                    Left
                                                </option>
                                                <option value="right">
                                                    Right
                                                </option>
                                                <option value="bottom-left">
                                                    Bottom Left
                                                </option>
                                                <option value="top-right">
                                                    Top Right
                                                </option>
                                            </select>
                                        </div>
                                    </label>

                                    <label
                                        className={`${s.builderCheck} ${s.builderFieldWide}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={radicalBg}
                                            onChange={(e) =>
                                                setRadicalBg(e.target.checked)
                                            }
                                        />
                                        <span>
                                            Radical background (gradient circles
                                            + depth)
                                        </span>
                                    </label>
                                </>
                            ) : null}
                        </div>

                        <div className={s.builderBtns}>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnPrimary}`}
                                onClick={handleSubmit}
                            >
                                {editorMode === "create"
                                    ? "Create Theme"
                                    : "Save Changes"}
                            </button>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnGhost}`}
                                onClick={handleCancelEditor}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnGhost}`}
                                onClick={() => setHelpOpen(true)}
                            >
                                Help
                            </button>
                        </div>
                    </div>
                ) : null}
            </section>

            {contextMenu && contextTheme ? (
                <div
                    className={s.themeContextMenu}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className={s.themeContextItem}
                        onClick={() => openEdit(contextTheme.id)}
                    >
                        Edit
                    </button>
                    <button
                        className={s.themeContextItem}
                        onClick={handleDuplicateTheme}
                    >
                        Duplicate
                    </button>
                    <button
                        className={`${s.themeContextItem} ${s.themeContextDelete}`}
                        onClick={() => {
                            onDeleteTheme(contextTheme.id);
                            setContextMenu(null);
                        }}
                    >
                        Delete
                    </button>
                </div>
            ) : null}

            {emojiModalOpen ? (
                <div
                    className={s.helpOverlay}
                    onClick={(e) => {
                        if (e.currentTarget === e.target) {
                            setEmojiModalOpen(false);
                            setEmojiError("");
                        }
                    }}
                >
                    <div className={s.helpModal}>
                        <h3 className={s.helpTitle}>Add Emoji</h3>
                        <div className={s.sectionRule} />
                        <label className={s.builderField}>
                            <span className={s.builderLabelTitle}>Emoji</span>
                            <input
                                className={s.builderInput}
                                type="text"
                                value={emojiInput}
                                onChange={(e) => {
                                    setEmojiInput(e.target.value);
                                    if (emojiError) setEmojiError("");
                                }}
                                placeholder="Paste one emoji"
                                autoFocus
                            />
                            {emojiError ? (
                                <span className={s.builderError}>
                                    {emojiError}
                                </span>
                            ) : null}
                        </label>
                        <div className={s.builderBtns}>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnPrimary}`}
                                onClick={saveCustomEmoji}
                            >
                                Save Emoji
                            </button>
                            <button
                                className={`${s.bldBtn} ${s.bldBtnGhost}`}
                                onClick={() => {
                                    setEmojiModalOpen(false);
                                    setEmojiError("");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {helpOpen ? (
                <div
                    className={s.helpOverlay}
                    onClick={(e) => {
                        if (e.currentTarget === e.target) setHelpOpen(false);
                    }}
                >
                    <div className={s.helpModal}>
                        <h3 className={s.helpTitle}>Theme Builder Help</h3>
                        <div className={s.sectionRule} />
                        <div className={s.helpList}>
                            {HELP_ITEMS.map(([title, desc]) => (
                                <div key={title} className={s.helpItem}>
                                    <span className={s.helpDot}>·</span>
                                    <strong>{title}:</strong> {desc}
                                </div>
                            ))}
                        </div>
                        <button
                            className={`${s.bldBtn} ${s.bldBtnPrimary}`}
                            onClick={() => setHelpOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            ) : null}

            {limitModalOpen ? (
                <div
                    className={s.helpOverlay}
                    onClick={(e) => {
                        if (e.currentTarget === e.target)
                            setLimitModalOpen(false);
                    }}
                >
                    <div className={s.helpModal}>
                        <h3 className={s.helpTitle}>Theme Limit Reached</h3>
                        <div className={s.sectionRule} />
                        <p className={s.settingsP} style={{ marginBottom: 0 }}>
                            You have reached the max amount of themes, please
                            either delete one or{" "}
                            <strong>upgrade subscription</strong>.
                        </p>
                        <button
                            className={`${s.bldBtn} ${s.bldBtnPrimary}`}
                            onClick={() => setLimitModalOpen(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            ) : null}

            <section>
                <h2 className={s.settingsH2}>Settings Display</h2>
                <div className={s.sectionRule} />
                <p className={s.settingsP}>
                    Choose where this settings panel sits inside the page.
                </p>
                <div className={s.settingsDisplayRow}>
                    <button
                        className={`${s.bldBtn} ${settingsDisplay === "left" ? s.bldBtnPrimary : s.bldBtnGhost}`}
                        onClick={() => setSettingsDisplay("left")}
                    >
                        Left
                    </button>
                    <button
                        className={`${s.bldBtn} ${settingsDisplay === "center" ? s.bldBtnPrimary : s.bldBtnGhost}`}
                        onClick={() => setSettingsDisplay("center")}
                    >
                        Center
                    </button>
                    <button
                        className={`${s.bldBtn} ${settingsDisplay === "right" ? s.bldBtnPrimary : s.bldBtnGhost}`}
                        onClick={() => setSettingsDisplay("right")}
                    >
                        Right
                    </button>
                </div>
            </section>

            <section>
                <h2 className={s.settingsH2}>Dashboard Layout</h2>
                <div className={s.sectionRule} />
                <p className={s.settingsP}>
                    Click{" "}
                    <strong style={{ color: "var(--dash-accent-warm)" }}>
                        Edit Dashboard
                    </strong>{" "}
                    in the top bar to drag and resize widgets. Your layout is
                    saved automatically when you click Save Layout.
                </p>
            </section>

            <button
                className={s.resetSettingsBtn}
                onClick={() => {
                    handleCancelEditor();
                    setSettingsDisplay("center"); // persists via the store
                    onResetSettings();
                }}
            >
                Reset Settings
            </button>
        </div>
    );
}
