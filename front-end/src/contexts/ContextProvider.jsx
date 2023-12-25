import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
  isPopupOpen: true,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#114250");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);

  const setMode = (e) => {
    setCurrentMode(e.target.value);

    localStorage.setItem("themeMode", e.target.value);

    // Kalau udah milih mode, sidebarnya nutup
    setThemeSettings(false);
  };

  const setColor = (color) => {
    setCurrentColor(color);

    localStorage.setItem("colorMode", color);

    // Kalau udah milih mode, sidebarnya nutup
    setThemeSettings(false);
  };

  const handlePopup = (isOpen) => {
    setIsClicked(() => ({
      ...initialState,
      isPopupOpen: isOpen,
    }));
  };

  // Fungsi untuk mengelola klik pada ikon
  const handleClick = (clicked) => {
    // Memperbarui state isClicked dengan menggunakan nilai sebelumnya (prevState)
    setIsClicked((prevState) => {
      // Membuat salinan state awal dan mengubah nilainya sesuai dengan ikon yang diklik
      const nextState = { ...initialState, [clicked]: !prevState[clicked] };

      // Menutup ikon lain jika ikon yang sama diklik kembali
      if (nextState[clicked]) {
        // Iterasi melalui setiap ikon dalam objek nextState
        Object.keys(nextState).forEach((key) => {
          // Jika ikon tidak sama dengan yang diklik, maka tutup ikon tersebut dengan mengubah nilainya menjadi false
          if (key !== clicked) {
            nextState[key] = false;
          }
        });
      }

      // Mengembalikan objek nextState sebagai nilai baru dari state isClicked setelah pembaruan
      return nextState;
    });
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        currentMode,
        setCurrentMode,
        currentColor,
        setCurrentColor,
        themeSettings,
        setThemeSettings,
        setMode,
        setColor,
        handlePopup, // Tambahkan handlePopup ke state
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
