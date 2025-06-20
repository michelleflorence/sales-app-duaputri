import React, { useState, useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../assets/img/avatar.jpg";
import avatar2 from "../assets/img/avatar2.jpg";
import avatar3 from "../assets/img/avatar3.jpg";
import avatar4 from "../assets/img/avatar4.jpg";
import { useNavigate } from "react-router-dom";
import { fetchData, getAuthHeaders } from "../helpers/helpers";
import Button from "./Button";
import CircleLoader from "./CircleLoader";
const { VITE_VERCEL_ENV } = import.meta.env;

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentColor, handlePopup } = useStateContext();
  const [officerData, setOfficerData] = useState({});
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchOfficerData = async () => {
      const url =
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/me"
          : "http://localhost:5000/me";
      try {
        setLoading(true);
        const data = await fetchData(url, getAuthHeaders());
        setOfficerData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching officer data:", error);
        setLoading(false);
      }
    };

    fetchOfficerData();
  }, []);

  const handleLogOut = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("roles");

    // Lakukan navigasi ke halaman login atau halaman lain yang sesuai
    navigate("/login");

    // Tutup pop-up
    handlePopup({ isPopupOpen: false });
  };

  const roleAvatarMapping = {
    superadmin: avatar2,
    kasir: avatar3,
    admin: avatar4,
    // Tambahkan role dan avatar sesuai dengan kebutuhan Anda
  };

  // Dapatkan avatar berdasarkan role
  const avatarImage =
    officerData.roles && roleAvatarMapping[officerData.roles.toLowerCase()]
      ? roleAvatarMapping[officerData.roles.toLowerCase()]
      : avatar;

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
          className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          type="button"
          onClick={() => handlePopup({ isPopupOpen: false })}
          style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
        >
          <MdOutlineCancel />
        </button>
      </div>

      {/* Loader: Display when loading */}
      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <CircleLoader />
        </div>
      ) : (
        <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
          <img
            className="rounded-full h-24 w-24"
            src={avatarImage}
            alt="user-profile"
          />
          <div>
            <p className="font-semibold text-xl dark:text-gray-200">
              {officerData.name}
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {officerData.roles}
            </p>
            <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
              {officerData.email}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          borderRadius="10px"
          fullWidth={true}
          onClick={handleLogOut}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
