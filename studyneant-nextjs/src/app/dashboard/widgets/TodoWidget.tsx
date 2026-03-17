"use client";

import { useState } from "react";
import s from "../Dashboard.module.css";

type TodoItem = { id: number; text: string; done: boolean };

const INITIAL: TodoItem[] = [
    { id: 1, text: "Finish React dashboard", done: false },
    { id: 2, text: "Study for Calculus quiz", done: false },
    { id: 3, text: "Read Chapter 7", done: true },
    { id: 4, text: "Email professor", done: false },
];

export default function TodoWidget() {
    const [items, setItems] = useState<TodoItem[]>(INITIAL);
    const [val, setVal] = useState("");

    const toggle = (id: number) =>
        setItems((p) =>
            p.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        );

    const add = () => {
        const text = val.trim();
        if (!text) return;
        setItems((p) => [...p, { id: Date.now(), text, done: false }]);
        setVal("");
    };

    return (
        <div className={s.todoWrap}>
            <ul className={s.todoList}>
                {items.map(({ id, text, done }) => (
                    <li
                        key={id}
                        className={`${s.todoItem} ${done ? s.todoItemDone : ""}`}
                        onClick={() => toggle(id)}
                    >
                        <span className={s.todoChk}>{done ? "☑" : "☐"}</span>
                        <span className={s.todoTxt}>{text}</span>
                    </li>
                ))}
            </ul>
            <div className={s.todoAdd}>
                <input
                    className={s.todoInput}
                    placeholder="Add task…"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && add()}
                />
                <button className={s.todoBtn} onClick={add}>
                    +
                </button>
            </div>
        </div>
    );
}
