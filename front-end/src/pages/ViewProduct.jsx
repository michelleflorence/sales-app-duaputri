import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components";
import product6 from "../data/blank.jpg";

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
          `http://localhost:5000/products/${uuid}`,
          { headers }
        );

        // Mengisi state dengan data produk yang diterima
        const productData = response.data;
        console.log("Status:", productData.status);
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
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="View Product" />

      {/* CARD */}
      <div className="flex items-center justify-center h-full">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
                ? `http://localhost:5000/uploads/${images}`
                : product6
            }
            alt=""
          />
          <div className="p-5">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate dark:text-white">
                      Product Name
                    </p>
                    <p className="text-base text-gray-600 truncate dark:text-gray-400">
                      {productName}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate dark:text-white">
                      Price
                    </p>
                    <p className="text-base text-gray-600 truncate dark:text-gray-400">
                      {`Rp. ${Number(price).toLocaleString(
                        "id-ID"
                      )}`}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate dark:text-white">
                      Status
                    </p>
                    <p className="text-base text-gray-600 truncate dark:text-gray-400">
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
