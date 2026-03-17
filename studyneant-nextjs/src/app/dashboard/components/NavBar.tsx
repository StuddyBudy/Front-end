"use client";

import Link from "next/link";
import styles from "./NavBar.module.css";

type NavbarProps = {
    onLoginClick: () => void;
    onSignupClick: () => void;
};

export default function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
    return (
        <header className={styles.navbar}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
                <span className={styles.logoMark}>◈</span>
                <span className={styles.logoText}>StudyNeant</span>
            </Link>

            {/* Nav links */}
            <nav className={styles.links}>
                <a href="#features" className={styles.navLink}>
                    Features
                </a>
                <a href="#how" className={styles.navLink}>
                    How it works
                </a>
            </nav>

            {/* Auth buttons */}
            <div className={styles.actions}>
                <button className="btn-ghost" onClick={onLoginClick}>
                    Log in
                </button>
                <button className="btn-primary" onClick={onSignupClick}>
                    Get started free
                </button>
            </div>
        </header>
    );
}
