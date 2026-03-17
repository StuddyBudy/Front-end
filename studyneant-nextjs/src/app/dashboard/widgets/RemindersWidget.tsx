"use client";

import s from "../Dashboard.module.css";

const REMINDERS = [
    "Call mom 📞",
    "Submit lab report — Friday",
    "Group project @ 3 PM Tue",
    "Pay tuition deposit",
];

export default function RemindersWidget() {
    return (
        <ul className={s.reminderList}>
            {REMINDERS.map((r) => (
                <li key={r} className={s.reminderItem}>
                    {r}
                </li>
            ))}
        </ul>
    );
}
