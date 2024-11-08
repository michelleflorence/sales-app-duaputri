import React, { useState } from "react";
import logoDuaPutri from "../data/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../contexts/ContextProvider";
import Tooltip from "@mui/material/Tooltip";
import { FiSettings } from "react-icons/fi";
import { ThemeSettings } from "../components";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const { VITE_VERCEL_ENV } = import.meta.env;

const Login = () => {
  const { themeSettings, setThemeSettings, currentColor, currentMode } =
    useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Function to handle login request
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        VITE_VERCEL_ENV  === "production"
          ? "https://sales-app-server-zeta.vercel.app/login"
          : "http://localhost:5000/login",
        {
          email,
          password,
        }
      );
      const { token, roles } = response.data;

      // Save token and officer data to local storage if needed
      localStorage.setItem("token", token);
      localStorage.setItem("roles", roles);

      // Fetch additional data after successful login
      const fetchDataResponse = await axios.get(
        VITE_VERCEL_ENV  === "production"
          ? "https://sales-app-server-zeta.vercel.app/officers"
          : "http://localhost:5000/officers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // You can use the fetched data as needed
      const officerData = fetchDataResponse.data;
      console.log("Fetched officer data:", officerData);

      // Navigate or perform other actions after successful login
      navigate("/"); // Example navigation to the dashboard page after login

      // Show success toast
      toast.success("Login successful!");
    } catch (error) {
      // Handle login errors
      console.error("Error during login:", error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="min-h-screen dark:bg-main-dark-bg dark:text-gray-200">
        <div
          className="fixed right-4 bottom-4 dark:bg-main-dark-bg"
          style={{ zIndex: "1000" }}
        >
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-main-dark-bg dark:text-gray-200">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-20 w-auto"
              src={logoDuaPutri}
              alt="Your Company"
            />
            <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-200">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm dark:text-gray-200 dark:bg-main-dark-bg">
            <form
              className="space-y-6 dark:bg-main-dark-bg dark:text-gray-200"
              method="POST"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-900 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-900 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  style={{ backgroundColor: currentColor }}
                  type="submit"
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-900"
                >
                  Sign in
                </button>
              </div>
              <div>
                {/* Only show theme settings if it is currently true */}
                {themeSettings && <ThemeSettings />}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
