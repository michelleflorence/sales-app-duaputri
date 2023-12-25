import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = ({ redirectPath = "/", children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Mengatur status autentikasi berdasarkan ketersediaan token
      setIsAuthenticated(!!token);

      // Jika terautentikasi, navigasi ke halaman yang diinginkan
      if (token) {
        navigate(redirectPath);
      }
    };

    checkAuthentication();
  }, [navigate, redirectPath]);

  // Menentukan apakah sudah terotorisasi, dari konteks atau cara lain yang Anda gunakan
  // Jika terotorisasi, kembalikan suatu outlet yang akan merender elemen-elemen anak
  // Jika tidak, kembalikan elemen yang akan mengarahkan ke halaman login
  return isAuthenticated ? (
    <Outlet>{children}</Outlet>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
