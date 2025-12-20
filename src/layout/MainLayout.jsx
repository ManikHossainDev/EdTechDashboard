import { Outlet } from "react-router-dom";
import Sidebar from "../component/Main/Sidebar/Sidebar";
import Header from "../component/Main/Header/Header";
import { useState } from "react";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <main className="w-full flex bg-[#F5F5F5] min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <section className="w-full h-full md:ml-[200px] lg:ml-[250px] xl:ml-[280px]">
        <div className="px-2 ">
         <div className=" md:px-2 sticky top-1 right-0 z-[999999]">
           <Header toggleSidebar={toggleSidebar} />
         </div>
        <Outlet />
        </div>
      </section>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 px-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </main>
  );
};
export default MainLayout;
