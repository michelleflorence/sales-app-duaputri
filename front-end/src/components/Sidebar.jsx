import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { links } from "../data/dummy";
import logoDuaPutri from "../data/logo2.png";
import { useStateContext } from "../contexts/ContextProvider";
import BarLoader from "./BarLoader";
import { fetchData, getAuthHeaders } from "../helpers/helpers";
const { VITE_VERCEL_ENV } = import.meta.env;

const Sidebar = () => {
  const [officerData, setOfficerData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { activeMenu, setActiveMenu, screenSize, currentColor } =
    useStateContext();

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  // Get data officer
  useEffect(() => {
    const fetchOfficerData = async () => {
      const url =
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/me"
          : "http://localhost:5000/me";
      try {
        const data = await fetchData(url, getAuthHeaders());
        setOfficerData(data);
      } catch (error) {
        console.error("Error fetching officer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficerData();
  }, []);

  const isSuperAdmin = officerData.roles === "superadmin";
  const isAdmin = officerData.roles === "admin";
  const isCashier = officerData.roles === "kasir";

  const renderLinks = (linksArray) => {
    return linksArray.map((item) => {
      const allowedLinks = item.links.filter((link) => {
        if (isSuperAdmin) {
          // Superadmin bisa mengakses semua link
          return true;
        } else if (isAdmin) {
          // Admin hanya bisa mengakses dashboard dan products
          return link.name === "dashboard" || link.name === "products";
        } else if (isCashier) {
          // Cashier hanya bisa mengakses dashboard, orders, dan customers
          return (
            link.name === "dashboard" ||
            link.name === "orders" ||
            link.name === "customers"
          );
        }
        // Default: Tampilkan link jika tidak ada peraturan khusus
        return true;
      });

      if (allowedLinks.length > 0) {
        return (
          <div key={item.title}>
            <p className="text-gray-400 m-3 mt-4 uppercase">{item.title}</p>
            {allowedLinks.map((link) => (
              <NavLink
                key={link.name}
                to={`/${link.name}`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                {link.icon}
                <span className="capitalize">{link.displayName}</span>
              </NavLink>
            ))}
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            {/* Icon Logo */}
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img className="w-14" src={logoDuaPutri} alt="logoDuaPutri" />{" "}
              <span className="dark:text-gray-200">Dua Putri</span>
            </Link>
            {/* Cancel Icon */}
            <Tooltip title="Menu">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu((prevActiveMenu) => !prevActiveMenu)
                }
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden dark:text-white dark:hover:bg-slate-600"
              >
                <MdOutlineCancel />
              </button>
            </Tooltip>
          </div>

          {/* Show a loading spinner while fetching data */}
          {isLoading ? (
            <div className="text-center mt-10">
              <BarLoader />
            </div>
          ) : (
            <div className="mt-10">{renderLinks(links)}</div>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
