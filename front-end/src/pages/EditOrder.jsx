import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const { VITE_VERCEL_ENV } = import.meta.env;

const EditOrder = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerPhone: "",
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          VITE_VERCEL_ENV 
            ? `https://sales-app-server-zeta.vercel.app/orders/${uuid}`
            : `http://localhost:5000/orders/${uuid}`,
          { headers }
        );

        const orderData = response.data;
        setOrderData({
          customerName: orderData.customer.name,
          customerPhone: orderData.customer.phone,
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [uuid]);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();

    try {
      // Ambil token otentikasi dari local storage
      const token = localStorage.getItem("token");

      // Persiapkan header Authorization menggunakan token
      const headerToken = {
        Authorization: `Bearer ${token}`,
      };

      // Ambil detail pesanan saat ini
      const orderDetailsResponse = await axios.get(
        VITE_VERCEL_ENV  === "production"
          ? `https://sales-app-server-zeta.vercel.app/orders/${uuid}`
          : `http://localhost:5000/orders/${uuid}`,
        { headers: headerToken }
      );

      // Ekstrak detail pesanan dari respons
      const orderDetails = orderDetailsResponse.data;

      // Perbarui detail pesanan
      const updateOrderResponse = await axios.patch(
        VITE_VERCEL_ENV  === "production"
          ? `http://localhost:5000/orders/${uuid}`
          : `https://sales-app-server-zeta.vercel.app/orders/${uuid}`,
        {
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
        },
        { headers: headerToken }
      );

      // Tangani respons dari server untuk pembaruan pesanan
      if (updateOrderResponse.status === 200) {
        // Tampilkan pesan sukses
        toast.success(updateOrderResponse.data.msg);

        // Gunakan UUID pelanggan dari detail pesanan untuk memperbarui informasi pelanggan
        const customerUUID = orderDetails.customer.uuid;
        const updateCustomerResponse = await axios.patch(
          VITE_VERCEL_ENV  === "production"
            ? `https://sales-app-server-zeta.vercel.app/customers/${customerUUID}`
            : `http://localhost:5000/customers/${customerUUID}`, // Sesuaikan endpoint
          {
            name: orderData.customerName,
            phone: orderData.customerPhone,
          },
          { headers: headerToken }
        );

        // Periksa apakah pembaruan pelanggan berhasil
        if (updateCustomerResponse.status === 200) {
          // Tampilkan pesan sukses untuk pembaruan pelanggan
          toast.success(updateCustomerResponse.data.msg);
        } else {
          // Tampilkan pesan error jika pembaruan pelanggan gagal
          toast.error(
            `Failed to update customer: ${updateCustomerResponse.data.msg}`
          );
        }

        // Redirect ke halaman pesanan setelah pembaruan berhasil
        navigate("/orders");
      } else {
        // Tampilkan pesan error jika pembaruan pesanan gagal
        toast.error(`Failed to update order: ${updateOrderResponse.data.msg}`);
      }
    } catch (error) {
      // Tangani error, log respons error detail jika ada
      if (error.response) {
        console.log("Detailed Error Response:", error.response.data);
      }

      // Tampilkan pesan error umum untuk error lainnya
      toast.error("Failed to update order");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      [name]: value,
    }));
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Edit Order" />
      <form method="POST" onSubmit={handleUpdateOrder}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="customerName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer Name
            </label>
            <input
              value={orderData.customerName}
              onChange={handleChange}
              type="text"
              name="customerName"
              id="customerName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Type customer name"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="customerPhone"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer Phone
            </label>
            <input
              value={orderData.customerPhone}
              onChange={handleChange}
              type="text"
              name="customerPhone"
              id="customerPhone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Type customer phone"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="mt-4 hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
            style={{ backgroundColor: currentColor }}
          >
            Edit Order
          </button>
          <Link to="/orders">
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

export default EditOrder;
