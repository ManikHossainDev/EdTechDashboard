/* eslint-disable react/prop-types */
import image from "../../../assets/auth/hi 1.png"
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
// import { useSelector } from "react-redux";
// import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { RiNotificationFill } from "react-icons/ri";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  // const { user } = useSelector((state) => state.auth);

  return (
    <div className="border mt-[2px] rounded-md border-[#D8D8D8] bg-[#FFFFFF] w-full px-2 md:px-5 py-2 md:py-2 shadow flex justify-between items-cente   ">
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>

        <div className=" flex items-center space-x-1">
          <h1 className="text-base md:text-xl lg:text-2xl"> <span className="text-[#FF9E1C] " >Hi,</span> Same</h1>
          <img className="size-10" src={image} alt="image" />
        </div>
      </div>

      <div className="flex justify-between items-center gap-8">
        <Link to={"/notification"}>
          <h1 className="relative  p-2 rounded-md border-2 border-b-[#FF9E1C] bg-white">
            <RiNotificationFill className="size-2 md:size-8"  />{" "}
          </h1>
        </Link>
        <img
          onClick={() => navigate("/personal-info")}
          // src={`${imageBaseUrl}${user?.image?.url}`}
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="size-6 md:size-12 rounded-md cursor-pointer border border-gray-500"
        />
      </div>
    </div>
  );
};

export default Header;
