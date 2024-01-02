import React, { useState } from "react";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const AddProduct = () => {
  const { currentColor } = useStateContext();
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("0");
  const [images, setImages] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headerToken = {
        Authorization: `Bearer ${token}`,
      };

      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("status", status);
      formData.append("images", images);

      const response = await axios.post(
        "http://localhost:5000/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...headerToken,
          },
        }
      );

      // Menangani respons dari server
      if (response.status === 201) {
        toast.success(response.data.msg);
        // Redirect ke halaman produk setelah penambahan produk
        navigate("/products");
      } else {
        toast.error("Failed to add product:", response.data.msg);
      }
    } catch (error) {
      // Tangani kesalahan, misalnya, tampilkan pesan kesalahan kepada pengguna
      toast.error("Failed to add product:", error.response.data.msg);
    }
  };

  const handleFileChange = (e) => {
    // Mengupdate state gambar saat ada perubahan pada input file
    setImageName(e.target.files[0]?.name || null);

    // Mengubah state image
    setImages(e.target.files[0] || null);
  };

  const handleRemoveImage = () => {
    // Fungsi ini akan dipanggil ketika pengguna ingin menghapus gambar
    setImages(null);
    setImageName(null);
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Add Product" />
      <form method="POST" onSubmit={handleAddProduct}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Product Name
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type product name"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Price
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              name="price"
              id="price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="2000.00"
              required
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              id="status"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="0">Available</option>
              <option value="1">Empty</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="images"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Images
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {imageName ? (
                  <div>
                    <img
                      src={`path/to/your/images/${imageName}`}
                      alt={imageName}
                      className="mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-sm text-red-500 dark:text-red-400 hover:underline focus:outline-none"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JPG or PNG (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  accept=".jpeg, .jpg, .png, .webp"
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="mt-4 hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
            style={{ backgroundColor: currentColor }}
          >
            Add Product
          </button>
          <Link to="/products">
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

export default AddProduct;
