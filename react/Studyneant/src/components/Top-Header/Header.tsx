<link href="../style.css" rel="stylesheet" />;
import "../../style.css";

export default function Header() {
    return (
        <>
            <script defer src="../theme.js"></script>
            <link rel="shortcut icon" href="favicon.svg" type="image/x-icon" />
            <body className="bg-background-1 text-text">
                <nav className="flex justify-between w-full shadow hidden sm:flex sticky mb-2">
                    <a
                        className="p-2 rounded transition hover:bg-background-2"
                        href="../index.html"
                    >
                        Home
                    </a>

                    <div className="flex justify-around gap-x-2">
                        <a
                            className="hover:bg-background-2 p-2 rounded"
                            href="../gpa/step1.html"
                        >
                            GPA
                        </a>
                        <a
                            className="hover:bg-background-2 p-2 rounded "
                            href="../todo/to-do.html"
                        >
                            Todo
                        </a>
                        <a
                            className="hover:bg-background-2 p-2 rounded"
                            href="../pass/index.html"
                        >
                            Passwords
                        </a>

                        <select
                            id="theme-toggle-web"
                            className="bg-background-1 border p-2 rounded hover:bg-background-2 "
                            aria-label="Theme selection"
                        >
                            <option disabled selected>
                                Theme:
                            </option>
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
                    <a
                        className="hover:bg-background-2 border p-2 rounded"
                        href="../index.html"
                    >
                        Home
                    </a>
                    <a
                        className="hover:bg-background-2 border p-2 rounded"
                        href="../gpa/step1.html"
                    >
                        GPA
                    </a>
                    <a
                        className="hover:bg-background-2 border p-2 rounded"
                        href="../todo/to-do.html"
                    >
                        Todo
                    </a>
                    <a
                        className="hover:bg-background-2 border p-2 rounded"
                        href="../pass/index.html"
                    >
                        Passwords
                    </a>

                    <select
                        id="theme-toggle-mobile"
                        className="bg-background-1 border p-2 rounded hover:bg-background-2 "
                        aria-label="Theme selection"
                    >
                        <option disabled selected>
                            Theme:
                        </option>
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
                <h1 className="text-4xl font-bold text-center">Lifelinee</h1>
            </body>
        </>
    );
}
