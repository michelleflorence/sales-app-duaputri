import React, { useState } from "react";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../helpers/helpers";
const { VITE_VERCEL_ENV } = import.meta.env;

const AddOfficer = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [officerData, setOfficerData] = useState({
    name: "",
    email: "",
    roles: "admin",
    password: "",
    confPassword: "",
  });

  const handleChange = (e) => {
    setOfficerData({
      ...officerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOfficer = async (e) => {
    e.preventDefault(); // Hindari pengiriman formulir secara default
    try {
      const headers = getAuthHeaders();

      // Panggil API untuk menambah pelanggan
      const response = await axios.post(
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/officers"
          : "http://localhost:5000/officers",
        officerData,
        { headers }
      );

      // Tampilkan pesan sukses atau lakukan aksi lain jika diperlukan
      // console.log(response.data.msg);

      // Atur kembali data pelanggan setelah berhasil menambahkan
      setOfficerData({
        name: "",
        email: "",
        roles: "",
        password: "",
        confPassword: "",
      });

      if (response.status === 201) {
        toast.success(response.data.msg);
        // Redirect ke halaman produk setelah penambahan produk
        navigate("/officers");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      // Tangani kesalahan jika terjadi
      console.error("Error during add officer:", error);

      // Tampilkan pesan kesalahan dari server jika tersedia
      if (error.response) {
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Add Officer" />
      <form method="POST" onSubmit={handleAddOfficer}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Officer Name
            </label>
            <input
              value={officerData.name}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Type officer name"
              required
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              value={officerData.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Type officer email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="roles"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Roles
            </label>
            <select
              value={officerData.roles}
              onChange={handleChange}
              name="roles"
              id="roles"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
            >
              <option value="admin">admin</option>
              <option value="kasir">kasir</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              value={officerData.password}
              onChange={handleChange}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="confPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <input
              value={officerData.confPassword}
              onChange={handleChange}
              id="confPassword"
              name="confPassword"
              type="password"
              autoComplete="current-password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="mt-4 hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
            style={{ backgroundColor: currentColor }}
          >
            Add Officer
          </button>
          <Link to="/officers">
            <button
              type="button"
              className="mt-4 hover:drop-shadow-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
            >
              Back
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddOfficer;
