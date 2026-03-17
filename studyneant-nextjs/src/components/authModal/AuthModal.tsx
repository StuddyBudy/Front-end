"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./AuthModal.module.css";

// ── TYPES ─────────────────────────────────────────────────────────────────────
type AuthMode = "signup" | "login";

type AuthModalProps = {
    initialMode: AuthMode;
    onClose: () => void;
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}

function MicrosoftIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="1" y="1" width="10" height="10" fill="#F25022" />
            <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
            <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
            <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
        </svg>
    );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
export default function AuthModal({ initialMode, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    // Close on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        // Prevent body scroll while modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    // Reset form when switching modes
    const switchMode = (next: AuthMode) => {
        setMode(next);
        setForm({ firstName: "", lastName: "", email: "", password: "" });
        setErrors({});
    };

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    const setField = (k: keyof typeof form, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    // Simple client-side validation
    const validate = () => {
        const errs: Partial<typeof form> = {};
        if (mode === "signup") {
            if (!form.firstName.trim()) errs.firstName = "Required";
            if (!form.lastName.trim()) errs.lastName = "Required";
        }
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            errs.email = "Enter a valid email";
        if (form.password.length < 8) errs.password = "At least 8 characters";
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setIsSubmitting(true);
        // TODO: wire up real auth (NextAuth, Supabase, etc.)
        await new Promise((r) => setTimeout(r, 900)); // fake delay
        setIsSubmitting(false);
        router.push("/dashboard");
    };

    return (
        <div
            className={styles.overlay}
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label={mode === "signup" ? "Create account" : "Log in"}
        >
            <div className={styles.modal}>
                {/* Close button */}
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Left: form */}
                <div className={styles.formSide}>
                    {/* Tab switcher */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
                            onClick={() => switchMode("signup")}
                        >
                            Sign up
                        </button>
                        <button
                            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
                            onClick={() => switchMode("login")}
                        >
                            Log in
                        </button>
                    </div>

                    {/* Heading */}
                    <h2 className={styles.heading}>
                        {mode === "signup"
                            ? "Create your account"
                            : "Welcome back"}
                    </h2>
                    <p className={styles.subheading}>
                        {mode === "signup"
                            ? "No credit card required. Start free today."
                            : "Log in to access your dashboard."}
                    </p>

                    {/* Form */}
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {mode === "signup" && (
                            <div className={styles.row}>
                                <div className={styles.fieldWrap}>
                                    <input
                                        className={`field-input ${errors.firstName ? styles.inputError : ""}`}
                                        placeholder="First name"
                                        value={form.firstName}
                                        onChange={(e) =>
                                            setField(
                                                "firstName",
                                                e.target.value,
                                            )
                                        }
                                        autoComplete="given-name"
                                    />
                                    {errors.firstName && (
                                        <span className={styles.errMsg}>
                                            {errors.firstName}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.fieldWrap}>
                                    <input
                                        className={`field-input ${errors.lastName ? styles.inputError : ""}`}
                                        placeholder="Last name"
                                        value={form.lastName}
                                        onChange={(e) =>
                                            setField("lastName", e.target.value)
                                        }
                                        autoComplete="family-name"
                                    />
                                    {errors.lastName && (
                                        <span className={styles.errMsg}>
                                            {errors.lastName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={styles.fieldWrap}>
                            <input
                                className={`field-input ${errors.email ? styles.inputError : ""}`}
                                type="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={(e) =>
                                    setField("email", e.target.value)
                                }
                                autoComplete="email"
                            />
                            {errors.email && (
                                <span className={styles.errMsg}>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className={styles.fieldWrap}>
                            <input
                                className={`field-input ${errors.password ? styles.inputError : ""}`}
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setField("password", e.target.value)
                                }
                                autoComplete={
                                    mode === "signup"
                                        ? "new-password"
                                        : "current-password"
                                }
                            />
                            {errors.password && (
                                <span className={styles.errMsg}>
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {mode === "login" && (
                            <div className={styles.forgotRow}>
                                <a href="#" className={styles.forgotLink}>
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn-primary ${styles.submitBtn}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span
                                    className={styles.spinner}
                                    aria-hidden="true"
                                />
                            ) : mode === "signup" ? (
                                "Create account"
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className={styles.divider}>
                        <span>
                            Or {mode === "signup" ? "sign up" : "log in"} with
                        </span>
                    </div>

                    {/* OAuth buttons */}
                    <div className={styles.oauthRow}>
                        <button className={`btn-ghost ${styles.oauthBtn}`}>
                            <GoogleIcon />
                            Google
                        </button>
                        <button className={`btn-ghost ${styles.oauthBtn}`}>
                            <MicrosoftIcon />
                            Microsoft
                        </button>
                    </div>

                    {/* Footer note */}
                    <p className={styles.footerNote}>
                        {mode === "signup" ? (
                            <>
                                By signing up, you agree to our{" "}
                                <a href="#">terms of service</a> and{" "}
                                <a href="#">privacy policy</a>.
                            </>
                        ) : (
                            <>
                                Don&apos;t have an account?{" "}
                                <button
                                    className={styles.switchLink}
                                    onClick={() => switchMode("signup")}
                                >
                                    Sign up free
                                </button>
                            </>
                        )}
                    </p>
                </div>

                {/* Right: illustration / brand panel */}
                <div className={styles.brandSide}>
                    <div className={styles.brandInner}>
                        <div className={styles.brandMark}>◈</div>
                        <h3 className={styles.brandName}>StudyOS</h3>
                        <p className={styles.brandTagline}>
                            Your academic command center
                        </p>

                        {/* Feature pills */}
                        <ul className={styles.featurePills}>
                            {[
                                { icon: "📊", text: "Track all your grades" },
                                { icon: "📅", text: "Weekly schedule grid" },
                                { icon: "✅", text: "Smart to-do lists" },
                                { icon: "📝", text: "Integrated notes" },
                            ].map(({ icon, text }) => (
                                <li key={text} className={styles.pill}>
                                    <span>{icon}</span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Decorative grid */}
                    <div className={styles.decorGrid} aria-hidden="true">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div key={i} className={styles.decorCell} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
