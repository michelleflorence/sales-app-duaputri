import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import avatar from "../data/avatar.jpg";
import avatar2 from "../data/avatar2.jpg";
import avatar3 from "../data/avatar3.jpg";
import avatar4 from "../data/avatar4.jpg";
import { UserProfile } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <Tooltip title={title}>
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ backgroundColor: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </Tooltip>
);

const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentColor,
  } = useStateContext();

  // Figure out the size initially when the windows loads
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }),
    [];

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  // Get data officer
  const [officerData, setOfficerData] = useState({});

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Mendapatkan data officer yang sedang login
        const response = await axios.get("http://localhost:5000/me", {
          headers,
        });

        // Set data officer ke state
        setOfficerData(response.data);
      } catch (error) {
        console.error("Error fetching officer data:", error);
      }
    };

    fetchOfficerData();
  }, []);

  const roleAvatarMapping = {
    // Tambahkan role dan avatar sesuai dengan kebutuhan Anda
    superadmin: avatar2,
    kasir: avatar3,
    admin: avatar4,
  };

  // Dapatkan avatar berdasarkan role
  const avatarImage =
    officerData.roles && roleAvatarMapping[officerData.roles.toLowerCase()]
      ? roleAvatarMapping[officerData.roles.toLowerCase()]
      : avatar;

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />

      <div className="flex">
        <Tooltip title="Profile">
          <div
            className="flex items-center cursor-pointer p-1 hover:bg-light-gray rounded-lg gap-1"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="rounded-full w-8 h-8"
              src={avatarImage}
              alt="avatar"
            />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>
              <span className="text-gray-400 font-bold ml-1 text-14">
                {officerData.name}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text=14" />
          </div>
        </Tooltip>

        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
