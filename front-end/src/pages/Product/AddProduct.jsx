import React, { useState } from "react";
import { Button, CircularProgress, Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../../helpers/helpers";
const { VITE_VERCEL_ENV } = import.meta.env;

const AddProduct = () => {
  const { currentColor } = useStateContext();
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("0");
  const [images, setImages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Menyiapkan header Authorization dengan menggunakan token
      const headerToken = getAuthHeaders();
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("status", status);
      formData.append("images", images);

      const response = await axios.post(
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/products"
          : "http://localhost:5000/products",
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
    } finally {
      setIsLoading(false);
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
    <div className="pt-[60px] md:pt-0">
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
        <Header category="Page" title="Add Product" />
        <form method="POST" onSubmit={handleAddProduct}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Product Name
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type product name"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Price
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                name="price"
                id="price"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="2000.00"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                id="status"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              >
                <option value="0">Available</option>
                <option value="1">Empty</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="images"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
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
                        className="text-sm text-red-500 hover:underline focus:outline-none"
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
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
          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              color="white"
              bgColor={currentColor}
              borderRadius="10px"
            >
              {isLoading ? <CircularProgress/> : "Add Product"}
            </Button>
            <Link to="/products">
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

export default AddProduct;
