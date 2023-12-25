import React, { useState, useEffect } from "react";
import { Header } from "../components";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const EditOfficer = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [officerData, setOfficerData] = useState({
    name: "",
    email: "",
    roles: "",
    password: "",
    confPassword: "",
  });

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:5000/officers/${uuid}`,
          { headers }
        );

        // Pastikan setiap properti memiliki nilai default jika kosong
        const defaultOfficerData = {
          name: "",
          email: "",
          roles: "",
          password: "",
          confPassword: "",
        };

        // Inisialisasi officerData dengan data dari server
        setOfficerData({ ...defaultOfficerData, ...response.data });
      } catch (error) {
        console.error("Error fetching officer data:", error);
      }
    };

    // Memanggil fungsi fetchOfficerData saat komponen dimuat
    fetchOfficerData();
  }, [uuid]);

  const handleUpdateOfficer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Kirim permintaan PATCH ke endpoint API untuk menyimpan perubahan data pelanggan
      const response = await axios.patch(
        `http://localhost:5000/officers/${uuid}`,
        officerData,
        {
          headers,
        }
      );

      // Menangani respons dari server
      if (response.status === 200) {
        toast.success(response.data.msg);

        // Redirect kembali ke halaman Officers setelah penyimpanan berhasil
        navigate("/officers");
      } else {
        toast.error("Failed to update officers:", response.data.msg);
      }
    } catch (error) {
      console.error("Error editing officer:", error);
      toast.error(error.response.data.msg);
    }
  };

  const handleChange = (e) => {
    setOfficerData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Edit Officer" />
      <form method="POST" onSubmit={handleUpdateOfficer}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Officer Name
            </label>
            <input
              value={officerData.name}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type officer name"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              value={officerData.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type officer email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="roles"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Roles
            </label>
            <input
              value={officerData.roles}
              onChange={handleChange}
              type="roles"
              name="roles"
              id="roles"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type officer roles"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              value={officerData.password || ""}
              onChange={handleChange}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="confPassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              value={officerData.confPassword || ""}
              onChange={handleChange}
              id="confPassword"
              name="confPassword"
              type="password"
              autoComplete="current-password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
            Edit Officer
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

export default EditOfficer;
