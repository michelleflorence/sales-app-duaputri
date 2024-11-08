import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ViewOrder = () => {
  const { currentColor } = useStateContext();
  const { uuid } = useParams();
  const [officerData, setOfficerData] = useState({});
  const [orderData, setOrderData] = useState({
    orderNumber: "",
    totalPrice: "",
    customerName: "",
    customerPhone: "",
    order_details: [],
    invoice: {
      invoiceDate: "",
      paymentType: "",
    },
  });

  // Fungsi untuk mengambil data order berdasarkan UUID
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
          `https://sales-app-server-zeta.vercel.app/orders/${uuid}`,
          { headers }
        );

        const orderData = response.data;
        setOrderData({
          orderNumber: orderData.orderNumber,
          totalPrice: orderData.totalPrice,
          customerName: orderData.customer.name,
          customerPhone: orderData.customer.phone,
          order_details: orderData.order_details,
          invoice: {
            invoiceDate: orderData.invoice.invoiceDate,
            paymentType: orderData.invoice.paymentType,
          },
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [uuid]);

  // Fungsi untuk mengambil data officer yang sedang login
  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Mendapatkan data officer yang sedang login
        const response = await axios.get("https://sales-app-server-zeta.vercel.app/me", {
          headers,
        });

        // Set data officer ke state
        setOfficerData(response.data);
      } catch (error) {
        console.error("Error fetching officer data:", error);
      }
    };

    fetchOfficerData();
  }, []);

  // Menentukan apakah officer memiliki peran cashier
  const isCashier = officerData.roles === "kasir";

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="View Order" />
      {/* Card */}
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Customer Name
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {orderData.customerName}
                    </p>
                  </div>
                </div>
              </li>

              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Customer Phone
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {orderData.customerPhone}
                    </p>
                  </div>
                </div>
              </li>

              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Order Number
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {orderData.orderNumber}
                    </p>
                  </div>
                </div>
              </li>

              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Order Items
                    </p>
                    <div className="text-base text-gray-600 truncate">
                      {orderData.order_details?.map((order_details, index) => (
                        <div key={index}>
                          {order_details.product?.productName} (
                          {order_details.quantity})
                          {index < orderData.order_details.length - 1 && ","}{" "}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Total Price
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {`Rp. ${Number(orderData.totalPrice).toLocaleString(
                        "id-ID"
                      )}`}
                    </p>
                  </div>
                </div>
              </li>

              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Invoice Details
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      Invoice Date: {orderData.invoice.invoiceDate}
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      Payment Type: {orderData.invoice.paymentType}
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            {/* Button */}
            <Link to="/orders">
              <button
                type="button"
                className="mt-4 ml-4 hover:drop-shadow-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
              >
                Back
              </button>
            </Link>
            {isCashier && (
              <Link to="/addorder">
                <button
                  style={{ backgroundColor: currentColor }}
                  type="button"
                  className="mt-4 ml-4 hover:drop-shadow-md hover:bg-teal-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
                >
                  Add New Order
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
