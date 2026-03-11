import { Routes, Route } from "react-router-dom";

import "./App.css";

import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import GpaCalc from "./pages/GpaCalc/GpaCalc.tsx";
import ToDo from "./pages/To-Do/ToDo.tsx";
import Notes from "./pages/Notes/Notes.tsx";

// import Sidebar from "./components/Sidebar/Sidebar.tsx";

export default function App() {
    return (
        <>
            {/* <Sidebar/> */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/GpaCalc" element={<GpaCalc />} />
                <Route path="/ToDo" element={<ToDo />} />
                <Route path="/Notes" element={<Notes />} />
            </Routes>
        </>
    );
}
