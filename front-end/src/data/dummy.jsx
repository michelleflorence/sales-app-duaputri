import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiBarChart } from "react-icons/fi";
import { BsBoxSeam, BsBox2Heart } from "react-icons/bs";
import { ImStatsBars2 } from "react-icons/im";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine, RiHistoryFill } from "react-icons/ri";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import axios from "axios";

export const GridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);

export const GridProductStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);

export const links = [
  {
    title: "Main",
    links: [
      {
        displayName: "Dashboard",
        name: "dashboard",
        icon: <ImStatsBars2 />,
      },
    ],
  },

  {
    title: "Pages",
    links: [
      {
        displayName: "Orders",
        name: "orders",
        icon: <AiOutlineShoppingCart />,
      },
      {
        displayName: "Products",
        name: "products",
        icon: <BsBox2Heart />,
      },
      {
        displayName: "Officers",
        name: "officers",
        icon: <IoMdContacts />,
      },
      {
        displayName: "Customers",
        name: "customers",
        icon: <RiContactsLine />,
      },
    ],
  },

  {
    title: "Logs",
    links: [
      {
        displayName: "Activity Log",
        name: "activitylog",
        icon: <RiHistoryFill />,
      },
    ],
  },
];

export const themeColors = [
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    name: "yellow-theme",
    color: "#ECE773",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "teal-theme",
    color: "#114250",
  },
  {
    name: "orange-theme",
    color: "#FBB540",
  },
];

const totalEarningData = () => {
  const [totalCustomers, setTotalCustomers] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);

  // Get total customers
  const getTotalCustomers = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("http://localhost:5000/customers", {
        headers,
      });
      setTotalCustomers(response.data.totalCustomers);
    } catch (error) {
      console.log("Error fetching customers data:", error.response.data);
    }
  };

  // Get total products
  const getTotalProducts = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("http://localhost:5000/products/total", {
        headers,
      });
      setTotalProducts(response.data);
    } catch (error) {
      console.log("Error fetching product data:", error.response.data);
    }
  };

  const getTotalOrders = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("http://localhost:5000/orders/total", {
        headers,
      });
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.log("Error fetching product data:", error.response.data);
    }
  };

  // Panggil fetchCustomersData dalam useEffect
  useEffect(() => {
    getTotalCustomers();
    getTotalProducts();
    getTotalOrders();
  }, []);

  // Return the earningData array
  return [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: totalCustomers, // Use totalCustomers here
      title: "Customers",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600",
    },
    {
      icon: <BsBoxSeam />,
      amount: totalProducts,
      title: "Products",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "green-600",
    },
    {
      icon: <FiBarChart />,
      amount: totalOrders,
      title: "Orders",
      iconColor: "rgb(228, 106, 118)",
      iconBg: "rgb(255, 244, 229)",

      pcColor: "green-600",
    },
  ];
};
export default totalEarningData;
