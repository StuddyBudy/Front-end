"use client";

import { useState } from "react";
import RGL from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type React from "react";
import type { LayoutItem } from "../types";
import s from "../Dashboard.module.css";

import GradesWidget from "../widgets/GradesWidget";
import TodoWidget from "../widgets/TodoWidget";
import RemindersWidget from "../widgets/RemindersWidget";
import ScheduleWidget from "../widgets/ScheduleWidget";

// ── GridLayout type cast ──────────────────────────────────────────────────────
// react-grid-layout ships its own types, but @types/react-grid-layout (if
// installed) overrides them and strips cols, rowHeight, etc. from GridLayoutProps.
// This cast sidesteps that conflict entirely.
type GridLayoutProps = {
    layout: LayoutItem[];
    cols?: number;
    rowHeight?: number;
    width: number;
    onLayoutChange?: (layout: LayoutItem[]) => void;
    isDraggable?: boolean;
    isResizable?: boolean;
    draggableHandle?: string;
    margin?: [number, number];
    containerPadding?: [number, number];
    useCSSTransforms?: boolean;
    children?: React.ReactNode;
    className?: string;
};
const GridLayout = RGL as unknown as React.ComponentType<GridLayoutProps>;

// ── PROPS ─────────────────────────────────────────────────────────────────────
type Props = {
    editMode: boolean;
    layout: LayoutItem[];
    onLayoutChange?: (l: LayoutItem[]) => void;
    gridWidth: number;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function DashboardView({
    editMode,
    layout,
    onLayoutChange,
    gridWidth,
}: Props) {
    const [mounted] = useState(true);

    return (
        <div className={`${s.gridWrap} ${editMode ? s.gridWrapEditing : ""}`}>
            {editMode && (
                <div className={s.editBanner}>
                    ✦ Edit Mode — drag to rearrange · resize from corners · hit
                    Save when done
                </div>
            )}
            <GridLayout
                layout={layout}
                cols={10}
                rowHeight={46}
                width={Math.max(gridWidth, 320)}
                onLayoutChange={onLayoutChange}
                isDraggable={editMode}
                isResizable={editMode}
                draggableHandle={`.${s.dragHandle}`}
                margin={[14, 14]}
                containerPadding={[0, 0]}
                useCSSTransforms
            >
                <div key="grades" className={s.widget}>
                    <div className={s.dragHandle}>
                        <span>📊</span> Grades
                    </div>
                    <div className={s.widgetBody}>
                        <GradesWidget />
                    </div>
                </div>
                <div key="todo" className={s.widget}>
                    <div className={s.dragHandle}>
                        <span>✅</span> To-Do
                    </div>
                    <div className={s.widgetBody}>
                        <TodoWidget />
                    </div>
                </div>
                <div key="reminders" className={s.widget}>
                    <div className={s.dragHandle}>
                        <span>🔔</span> Reminders
                    </div>
                    <div className={s.widgetBody}>
                        <RemindersWidget />
                    </div>
                </div>
                <div key="schedule" className={s.widget}>
                    <div className={s.dragHandle}>
                        <span>📅</span> Weekly Schedule
                    </div>
                    <div className={s.widgetBody}>
                        <ScheduleWidget />
                    </div>
                </div>
            </GridLayout>
        </div>
    );
}
