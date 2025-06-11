import { useState } from "react";
import logoDuaPutri from "../assets/img/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../contexts/ContextProvider";
import Tooltip from "@mui/material/Tooltip";
import { FiSettings } from "react-icons/fi";
import { Button, CircularProgress, ThemeSettings } from "../components";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const { VITE_VERCEL_ENV } = import.meta.env;

const Login = () => {
  const { themeSettings, setThemeSettings, currentColor, currentMode } =
    useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Validate password
  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  };

  // Function to handle login request
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/login"
          : "http://localhost:5000/login",
        {
          email,
          password,
        }
      );
      const { token, roles } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("roles", roles);

      await axios.get(
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/officers"
          : "http://localhost:5000/officers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="min-h-screen flex items-center justify-center dark:bg-main-dark-bg dark:text-gray-200">
        {/* Tooltip */}
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

        {/* Login form panel */}
        <div className="w-full lg:w-1/2 p-20 align-middle flex flex-col justify-center">
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    required
                    className="p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-900 sm:text-sm sm:leading-6"
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 mt-1">{emailError}</p>
                  )}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                    className="p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-900 sm:text-sm sm:leading-6"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                  )}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  color="white"
                  bgColor={currentColor}
                  borderRadius="10px"
                  fullWidth
                >
                  {isLoading ? <CircularProgress /> : "Sign in"}
                </Button>
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
