/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "/public/logo/logo.png";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/features/auth/authSlice";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdDashboard, MdFamilyRestroom } from "react-icons/md";
import { LuBoxes } from "react-icons/lu";

const sidebarItems = [  
  { path: "/", name: "Dashboard", icon: <MdDashboard className="size-6" /> },
  { path: "/Parents", name: "Parents", icon: <MdFamilyRestroom  className="size-6" /> },
  { path: "/Modules", name: "Modules", icon: <LuBoxes className="size-6"/>},
  { path: "/Earnings", name: "Earnings", icon: <RiMoneyDollarCircleFill className="size-6" /> },
  { path: "/settings", name: "Settings", icon: <IoSettingsSharp className="size-6" /> },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth");
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[220px] lg:w-[260px] xl:w-[280px] bg-[#FFFFFF] fixed h-screen shadow-2xl">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex flex-col  items-center pb-4  text-white my-4 border-b border-[#FF9E1C]">
              <img src={logo} alt="logo" className="w-[80%] h-[50px]" />
            </div>
            <ul className="flex flex-col gap-3">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-[80%] mx-auto px-5 py-4 flex items-center gap-3  rounded-md transition-all duration-300 ease-in-out hover:bg-[#FFDFD2] hover:text-red-500 ${
                      isActive ? "bg-[#FFDFD2] text-[#FF9E1C]" : ""
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-10 py-4 text-white mb-4"
          >
            <IoIosLogOut className="ml-2 size-8 bg-red-500 p-1 text-white rounded-md" />
            <span className="text-red-500">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#FFFFFF] shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col justify-center items-center pt-5 gap-2 text-white">
          <img src={logo} alt="logo" className="h-20 mb-5" />
        </div>
        <ul className="flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `w-[70%] mx-auto px-5 py-2 flex items-center gap-3 text-[#FFFFFF] rounded-md transition-all duration-300 ease-in-out hover:bg-[#85594B] ${
                  isActive ? "bg-[#85594B]" : ""
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </ul>
        <button
          onClick={() => {
            setShowModal(true);
            toggleSidebar();
          }}
          className="flex items-center gap-2 px-10 py-4 text-white ml-6"
        >
          <IoIosLogOut className="size-8 bg-red-500 p-1 rounded-md text-white" />
          <span>Logout</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;