import {
  Box,
  Circle,
  Square,
  Triangle,
  Star,
  Hexagon,
  Pentagon,
  Diamond,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Modules = () => {
  const moduleTabs = [
  { name: "One", path: ".", icon: <Box size={18} /> },
  { name: "Two", path: "two", icon: <Circle size={18} /> },
  { name: "Three", path: "three", icon: <Triangle size={18} /> },
  { name: "Four", path: "four", icon: <Square size={18} /> },
  { name: "Five", path: "five", icon: <Pentagon size={18} /> },
  { name: "Six", path: "six", icon: <Hexagon size={18} /> },
  { name: "Seven", path: "seven", icon: <Star size={18} /> },
  { name: "Eight", path: "eight", icon: <Diamond size={18} /> },
];
  return (
    <div className="py-5 md:px-2">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white md:p-6 rounded-t-lg shadow-sm border-b">
        {moduleTabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            end={tab.path === "."} 
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm md:text-md lg:text-lg transition-all
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {tab.icon}
            {tab.name}
          </NavLink>
        ))}
      </div>

      {/* Nested Route Content */}
      <div className=" bg-white p-4 rounded-b-md shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default Modules;
