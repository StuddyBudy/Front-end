import "./Settings.css";

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Settings() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "system",
    );

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "system") {
            const systemPrefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            root.setAttribute(
                "data-theme",
                systemPrefersDark ? "dark" : "light",
            );
        } else {
            root.setAttribute("data-theme", theme);
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <>
            <h1> Settings</h1>

            <nav className="flex justify-between w-full shadow sm:flex sticky mb-2">
                <nav className="p-2 rounded transition hover:bg-background-2">
                    <NavLink to="/">Dashboard</NavLink>
                    <NavLink to="/GpaCalc">GpaCalc</NavLink>
                    <NavLink to="/ToDo">ToDo</NavLink>
                </nav>

                <div className="flex justify-around gap-x-2">
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="bg-background-1 border p-2 rounded hover:bg-background-2 "
                        aria-label="Theme selection"
                    >
                        <option disabled>Theme:</option>
                        <option value="system">System</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="rose-pine">Rosé Pine</option>
                        <option value="nord">Nord</option>
                        <option value="ehs">Eagles</option>
                        <option value="catpuccin">Catpuccin</option>
                        <option value="starry">Starry</option>
                    </select>
                </div>
            </nav>

            <nav className="sm:hidden flex flex-col shadow gap-2 h-full absolute bg-background-1">
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-background-1 border p-2 rounded hover:bg-background-2 "
                    aria-label="Theme selection"
                >
                    <option disabled>Theme:</option>
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="rose-pine">Rosé Pine</option>
                    <option value="nord">Nord</option>
                    <option value="ehs">Eagles</option>
                    <option value="catpuccin">Catpuccin</option>
                    <option value="starry">Starry</option>
                </select>
            </nav>
        </>
    );
}
