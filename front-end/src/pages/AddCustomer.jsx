import React, { useState } from "react";
import { Header } from "../components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../helpers/helpers";

const { VITE_VERCEL_ENV } = import.meta.env;

const AddCustomer = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault(); // Hindari pengiriman formulir secara default
    try {
      const headers = getAuthHeaders();
      // Panggil API untuk menambah pelanggan
      const response = await axios.post(
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/customers"
          : "http://localhost:5000/customers",
        customerData,
        { headers }
      );
      if (response.status === 201) {
        // Tampilkan pesan sukses atau lakukan aksi lain jika diperlukan
        toast.success(response.data.msg);

        // Alihkan ke halaman tabel pelanggan setelah berhasil menambahkan
        navigate("/customers");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      // Tangani kesalahan jika terjadi
      console.log("Error during add customer:", error.response.data);

      // Tampilkan pesan kesalahan dari server jika tersedia
      if (error.response) {
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Add Customer" />
      <form method="POST" onSubmit={handleAddCustomer}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Customer Name
            </label>
            <input
              value={customerData.name}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type customer name"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Customer Phone
            </label>
            <input
              value={customerData.phone}
              onChange={handleChange}
              type="phone"
              name="phone"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type customer phone"
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
            Add Customers
          </button>
          <Link to="/customers">
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

export default AddCustomer;
