import React, { useState, useEffect } from "react";
import { Header } from "../components";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const EditCustomer = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `https://sales-app-server-zeta.vercel.app/customers/${uuid}`,
          { headers }
        );

        // Inisialisasi customerData dengan data dari server
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    // Memanggil fungsi fetchCustomerData saat komponen dimuat
    fetchCustomerData();
  }, [uuid]);

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Kirim permintaan PATCH ke endpoint API untuk menyimpan perubahan data pelanggan
      const response = await axios.patch(
        `https://sales-app-server-zeta.vercel.app/customers/${uuid}`,
        customerData,
        {
          headers,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.msg);

        // Redirect kembali ke halaman Customers setelah penyimpanan berhasil
        navigate("/customers");
      } else {
        toast.error("Failed to update product:", response.data.msg);
      }
    } catch (error) {
      console.log("Error editing customer:", error.response.data);
      toast.error(error.response.data.msg);
    }
  };

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Edit Customer" />
      <form method="POST" onSubmit={handleUpdateCustomer}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer Name
            </label>
            <input
              value={customerData.name}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Type customer name"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer Phone
            </label>
            <input
              value={customerData.phone}
              onChange={handleChange}
              type="phone"
              name="phone"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
            Edit Customers
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

export default EditCustomer;
