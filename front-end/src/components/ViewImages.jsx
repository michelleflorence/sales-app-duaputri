import React, { useState, useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import blank from "../assets/img/blank.jpg";
import axios from "axios";

const { VITE_VERCEL_ENV } = import.meta.env;

const ViewImages = ({ uuid, handleClose }) => {
  const { currentColor } = useStateContext();
  const [images, setImages] = useState(null);

  useEffect(() => {
    // Fungsi untuk mendapatkan data produk yang akan diperbarui
    const fetchProductData = async () => {
      try {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Mengirim permintaan ke server untuk mendapatkan data produk
        const response = await axios.get(
          VITE_VERCEL_ENV  === "production"
            ? `https://sales-app-server-zeta.vercel.app/${uuid}`
            : `http://localhost:5000/products/${uuid}`,
          { headers }
        );

        // Mengisi state dengan data produk yang diterima
        const productData = response.data;
        setImages(productData.images);
      } catch (error) {
        console.log("Error fetching product data:", error.response.data);
      }
    };

    fetchProductData();
  }, [uuid]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-half-transparent">
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-200">
        <button
          className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          type="button"
          onClick={() => handleClose(false)}
          style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
        >
          <MdOutlineCancel />
        </button>
        <div className="flex justify-center w-96">
          <img
            className="flex rounded-b-lg w-full h-96 object-cover justify-center"
            src={
              images && images.length > 0
                ? VITE_VERCEL_ENV  === "production"
                  ? `https://sales-app-server-zeta.vercel.app/uploads/${images}`
                  : `http://localhost:5000/uploads/${images}`
                : blank
            }
            alt="Product Images"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewImages;
