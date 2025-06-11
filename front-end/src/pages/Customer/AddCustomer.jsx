import React, { useState } from "react";
import { Button, CircularProgress, Header } from "../../components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../../helpers/helpers";

const { VITE_VERCEL_ENV } = import.meta.env;

const AddCustomer = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault(); // Hindari pengiriman formulir secara default
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[60px] md:pt-0">
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
            <Button
              type="submit"
              color="white"
              bgColor={currentColor}
              borderRadius="10px"
            >
              {isLoading ? <CircularProgress /> : "Add Customers"}
            </Button>
            <Link to="/customers">
              <Button
                type="button"
                bgColor="rgb(209 213 219)"
                borderRadius="10px"
              >
                Back
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
