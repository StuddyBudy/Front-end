import "./App.css";
import Header from "./components/Layout/Header/Header.tsx";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
    return (
        // I added Tailwind classes here so the whole background changes
        // when you pick a new theme from the dropdown!
        <div className="min-h-screen bg-background-2 text-text transition-colors duration-300">
            {/* The Header sits at the very top */}
            <Header />

            {/* The Main Content area */}
            <main className="container mx-auto p-4">
                {/* Right now we just show the Dashboard. 
                  Later, we will use React Router here to switch between pages! 
                */}
                <Dashboard />
            </main>
        </div>
    );
}
