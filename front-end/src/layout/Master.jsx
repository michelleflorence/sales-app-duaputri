import React from "react";
import { FiSettings } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import { Navbar, Footer, Sidebar, ThemeSettings } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const Master = ({ children }) => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
  } = useStateContext();

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <Tooltip title="Settings">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              onClick={() => setThemeSettings(true)}
              style={{ backgroundColor: currentColor, borderRadius: "50%" }}
            >
              <FiSettings />
            </button>
          </Tooltip>
        </div>

        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark: bg-secondary-dark-bg">
            {/* If the sidebar is not active */}
            <Sidebar />
          </div>
        )}

        <div
          className={
            activeMenu
              ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full"
              : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>

          <div>
            {/* Only show theme settings if it is currently true */}
            {themeSettings && <ThemeSettings />}
          </div>
          <main className="pb-4">{children}</main>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Master;
