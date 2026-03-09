// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";

// const NAV_LINKS = [
//     { to: "/", label: "Home", icon: "🏠", end: true },
//     { to: "/Notes", label: "Notes", icon: "📝", end: false },
//     { to: "/GpaCalc", label: "Grades", icon: "📊", end: false },
//     { to: "/Calendar", label: "Calendar", icon: "📅", end: false }, // FIX: was "Calandar"
//     { to: "/Settings", label: "Settings", icon: "⚙️", end: false },
// ];

// export default function Sidebar() {
//     // FIX: was false — sidebar was hidden on first load
//     const [isOpen, setIsOpen] = useState(true);

//     return (
//         <>
//             {/* Hamburger toggle */}
//             <button
//                 type="button"
//                 className={`hamburger-btn ${isOpen ? "open" : ""}`}
//                 id="sidebarToggle"
//                 onClick={() => setIsOpen((o) => !o)}
//                 aria-label="Toggle navigation"
//             >
//                 <span />
//                 <span />
//                 <span />
//             </button>

//             <aside className={`sidebar ${isOpen ? "" : "closed"}`} id="sidebar">
//                 <div className="sidebar-brand">StudyOS</div>

//                 <nav className="sidebar-nav">
//                     <ul>
//                         {NAV_LINKS.map(({ to, label, icon, end }) => (
//                             <li key={to}>
//                                 {/* FIX: React Router v6 active class syntax */}
//                                 <NavLink
//                                     to={to}
//                                     end={end}
//                                     className={({ isActive }) =>
//                                         isActive ? "active" : ""
//                                     }
//                                 >
//                                     <span className="sl-icon">{icon}</span>
//                                     <span className="sl-label">{label}</span>
//                                 </NavLink>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>

//                 <div className="sidebar-footer">
//                     {/* FIX: was NavLink to="/" which incorrectly matched Home */}
//                     <button className="sidebar-add-btn">
//                         <span>+</span> Add Page
//                     </button>
//                 </div>
//             </aside>
//         </>
//     );
// }
