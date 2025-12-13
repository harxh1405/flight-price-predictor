import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, LayoutDashboard, Plane } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={22} />,
    },
    {
      title: "Predict Price",
      path: "/predict",
      icon: <Plane size={22} />,
    },
  ];

  return (
    <div
      className={`h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 
      ${isOpen ? "w-56" : "w-20"}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {isOpen && (
          <h1 className="text-xl font-semibold tracking-wide">FlightSense</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-slate-800"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Menu Items */}
      <div className="mt-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors 
              hover:bg-slate-800 ${
                isActive ? "bg-slate-800 text-blue-400" : "text-gray-300"
              }`
            }
          >
            {item.icon}
            {isOpen && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer (Optional Branding) */}
      <div className="mt-auto p-4 text-xs text-gray-500">
        {isOpen && <p>© 2025 FlightSense</p>}
      </div>
    </div>
  );
}
