import { useState, useEffect } from "react";
// We dropped the Responsive wrapper to stop the crashing
import GridLayout from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Dashboard.css";

const defaultLayout = [
    { i: "grades", x: 0, y: 0, w: 3, h: 4 },
    { i: "todo", x: 3, y: 0, w: 5, h: 4 },
    { i: "schedule", x: 0, y: 4, w: 8, h: 8 },
    { i: "reminders", x: 8, y: 4, w: 4, h: 4 },
];

export default function Dashboard() {
    // Start with the default layout so the screen is never blank
    const [layout, setLayout] = useState<any[]>(defaultLayout);

    useEffect(() => {
        const savedLayout = localStorage.getItem("dashboardLayout");
        if (savedLayout) {
            try {
                setLayout(JSON.parse(savedLayout));
            } catch (error) {
                console.error("Failed to load layout", error);
            }
        }
    }, []);

    const handleLayoutChange = (newLayout: any[]) => {
        setLayout(newLayout);
        localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
    };

    return (
        <div className="dashboard-container">
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={30}
                width={1200} // Hardcoded for now just to get it working
                onLayoutChange={(currentLayout: any) =>
                    handleLayoutChange(currentLayout)
                }
                draggableHandle=".drag-handle"
            >
                <div key="grades" className="widget bg-background-1 text-text">
                    <div className="drag-handle bg-background-2">Grades</div>
                    <div className="widget-content">
                        <p>Calculus: A</p>
                        <p>Physics: B</p>
                    </div>
                </div>

                <div key="todo" className="widget bg-background-1 text-text">
                    <div className="drag-handle bg-background-2">
                        To-Do List
                    </div>
                    <div className="widget-content">
                        <ul>
                            <li>[ ] Finish React dashboard</li>
                            <li>[ ] Study for quiz</li>
                        </ul>
                    </div>
                </div>

                <div
                    key="schedule"
                    className="widget bg-background-1 text-text"
                >
                    <div className="drag-handle bg-background-2">
                        Daily Schedule
                    </div>
                    <div className="widget-content">
                        <p>8:00 AM - Class</p>
                    </div>
                </div>

                <div
                    key="reminders"
                    className="widget bg-background-1 text-text"
                >
                    <div className="drag-handle bg-background-2">Reminders</div>
                    <div className="widget-content">
                        <p>Call mom</p>
                    </div>
                </div>
            </GridLayout>
        </div>
    );
}
