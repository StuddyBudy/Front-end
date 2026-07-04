"use client";

import { useState } from "react";
import Navbar from "./dashboard/components/NavBar";
import AuthModal from "../components/authModal/AuthModal";
import styles from "./page.module.css";

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
export default function LandingPage() {
    const [modalMode, setModalMode] = useState<"signup" | "login" | null>(null);

    const openSignup = () => setModalMode("signup");
    const openLogin = () => setModalMode("login");
    const closeModal = () => setModalMode(null);

    return (
        <>
            <Navbar onLoginClick={openLogin} onSignupClick={openSignup} />

            <main className={styles.main}>
                {/* ── HERO ── */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <span className={styles.badgeDot} />
                            Now in beta — free for all students
                        </div>

                        <h1 className={styles.heroTitle}>
                            Your academic
                            <br />
                            <span className={styles.titleAccent}>
                                command center
                            </span>
                        </h1>

                        <p className={styles.heroSubtitle}>
                            Grades, notes, to-dos, and a full weekly schedule —
                            all in one beautiful, customizable dashboard.
                        </p>

                        <div className={styles.heroCtas}>
                            <button
                                className="btn-primary"
                                onClick={openSignup}
                            >
                                Get started free →
                            </button>
                            <button className="btn-ghost" onClick={openLogin}>
                                Log in
                            </button>
                        </div>

                        <p className={styles.heroNote}>
                            No credit card required. Set up in under 2 minutes.
                        </p>
                    </div>

                    {/* Dashboard preview illustration */}
                    <div className={styles.heroVisual} aria-hidden="true">
                        <div className={styles.mockDashboard}>
                            {/* Mock top bar */}
                            <div className={styles.mockTopBar}>
                                <div className={styles.mockDots}>
                                    <span />
                                    <span />
                                    <span />
                                </div>
                                <span className={styles.mockTitle}>
                                    StudyNeant
                                </span>
                            </div>
                            {/* Mock widgets */}
                            <div className={styles.mockGrid}>
                                {[
                                    { icon: "📊", label: "Grades", h: "tall" },
                                    { icon: "✅", label: "To-Do", h: "tall" },
                                    {
                                        icon: "🔔",
                                        label: "Reminders",
                                        h: "tall",
                                    },
                                    {
                                        icon: "📅",
                                        label: "Schedule",
                                        h: "wide",
                                    },
                                ].map(({ icon, label, h }) => (
                                    <div
                                        key={label}
                                        className={`${styles.mockWidget} ${styles[`widget-${h}`]}`}
                                    >
                                        <div className={styles.mockHandle}>
                                            <span>{icon}</span> {label}
                                        </div>
                                        <div className={styles.mockLines}>
                                            <div
                                                className={styles.mockLine}
                                                style={{ width: "80%" }}
                                            />
                                            <div
                                                className={styles.mockLine}
                                                style={{ width: "60%" }}
                                            />
                                            <div
                                                className={styles.mockLine}
                                                style={{ width: "70%" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Glow effect behind the preview */}
                        <div className={styles.heroGlow} />
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section className={styles.features} id="features">
                    <p className={styles.featuresLabel}>Everything you need</p>
                    <h2 className={styles.featuresTitle}>
                        Built for how students actually work
                    </h2>

                    <div className={styles.featureGrid}>
                        {[
                            {
                                icon: "📊",
                                title: "Grade Tracker",
                                body: "See every subject at a glance with colour-coded bars and instant GPA calculation.",
                            },
                            {
                                icon: "📅",
                                title: "Weekly Schedule",
                                body: "An interactive Mon–Fri grid. Click any cell to add a class, lab, or study block.",
                            },
                            {
                                icon: "✅",
                                title: "Smart To-Dos",
                                body: "Add tasks instantly, check them off with one click, never drop a deadline again.",
                            },
                            {
                                icon: "📝",
                                title: "Integrated Notes",
                                body: "Rich notes tied to your classes. Always one click away from the context you need.",
                            },
                            {
                                icon: "🎨",
                                title: "Custom Themes",
                                body: "Four built-in palettes plus a full theme builder — your dashboard, your aesthetic.",
                            },
                            {
                                icon: "⚡",
                                title: "Drag & Drop Layout",
                                body: "Edit mode lets you rearrange every widget. Layout saves automatically.",
                            },
                        ].map(({ icon, title, body }) => (
                            <div key={title} className={styles.featureCard}>
                                <span className={styles.featureIcon}>
                                    {icon}
                                </span>
                                <h3 className={styles.featureCardTitle}>
                                    {title}
                                </h3>
                                <p className={styles.featureCardBody}>{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section className={styles.how} id="how">
                    <p className={styles.featuresLabel}>Get up and running</p>
                    <h2 className={styles.featuresTitle}>
                        Three steps, then you&apos;re in
                    </h2>

                    <div className={styles.steps}>
                        {[
                            {
                                num: "01",
                                title: "Create a free account",
                                body: "Sign up with email, Google, or Microsoft in seconds.",
                            },
                            {
                                num: "02",
                                title: "Set up your dashboard",
                                body: "Drag widgets into place, pick a theme, add your classes.",
                            },
                            {
                                num: "03",
                                title: "Stay on top of it all",
                                body: "Grades, tasks, notes, and schedule always in one tab.",
                            },
                        ].map(({ num, title, body }) => (
                            <div key={num} className={styles.step}>
                                <span className={styles.stepNum}>{num}</span>
                                <h3 className={styles.stepTitle}>{title}</h3>
                                <p className={styles.stepBody}>{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA BANNER ── */}
                <section className={styles.ctaBanner}>
                    <h2 className={styles.ctaTitle}>Ready to get organised?</h2>
                    <p className={styles.ctaBody}>
                        Join students who&apos;ve made StudyNeant their academic
                        home base.
                    </p>
                    <button className="btn-primary" onClick={openSignup}>
                        Start for free — no card needed
                    </button>
                </section>

                {/* ── FOOTER ── */}
                <footer className={styles.footer}>
                    <span className={styles.footerLogo}>◈ StudyNeant</span>
                    <p className={styles.footerCopy}>
                        © {new Date().getFullYear()} StudyNeant. Built for
                        students, by students.
                    </p>
                </footer>
            </main>

            {/* Auth modal */}
            {modalMode && (
                <AuthModal initialMode={modalMode} onClose={closeModal} />
            )}
        </>
    );
}
