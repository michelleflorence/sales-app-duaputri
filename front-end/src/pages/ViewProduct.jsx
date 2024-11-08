import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components";
import product6 from "../data/blank.jpg";
const { VITE_VERCEL_ENV } = import.meta.env;

const ViewProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("0");
  const [images, setImages] = useState(null);
  const { uuid } = useParams(); // Mendapatkan ID produk dari parameter URL

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
            ? `https://sales-app-server-zeta.vercel.app/products/${uuid}`
            : `http://localhost:5000/products/${uuid}`,
          { headers }
        );

        // Mengisi state dengan data produk yang diterima
        const productData = response.data;
        setProductName(productData.productName);
        setPrice(productData.price);
        setStatus(productData.status);
        setImages(productData.images);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [uuid]);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="View Product" />

      {/* CARD */}
      <div className="flex items-center justify-center h-full">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
          <img
            className="rounded-t-lg"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100%",
              objectFit: "cover",
            }}
            src={
              images && images.length > 0
                ? VITE_VERCEL_ENV  === "production"
                  ? `https://sales-app-server-zeta.vercel.app/uploads/${images}`
                  : `http://localhost:5000/uploads/${images}`
                : product6
            }
            alt=""
          />
          <div className="p-5">
            <ul role="list" className="divide-y divide-gray-200">
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Product Name
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {productName}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Price
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {`Rp. ${Number(price).toLocaleString("id-ID")}`}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Status
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {status === 0 ? "Available" : "Empty"}
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <Link to="/products">
              <button
                type="button"
                className="mt-4 ml-4 hover:drop-shadow-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
              >
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
