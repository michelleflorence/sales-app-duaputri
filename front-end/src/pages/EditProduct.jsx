import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const { VITE_VERCEL_ENV } = import.meta.env;

const EditProduct = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("0");
  const { uuid } = useParams(); // Mendapatkan ID produk dari parameter URL
  // const [imageName, setImageName] = useState("");
  // const [images, setImages] = useState(null);

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
          VITE_VERCEL_ENV === "production"
            ? `https://sales-app-server-zeta.vercel.app/products/${uuid}`
            : `http://localhost:5000/products/${uuid}`,
          { headers }
        );

        // Mengisi state dengan data produk yang diterima
        const productData = response.data;
        setProductName(productData.productName);
        setPrice(productData.price);
        setStatus(productData.status);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [uuid]);

  // Fungsi untuk menangani pembaruan produk
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Membuat objek FormData untuk mengirim data dengan tipe form
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("status", status);

      // Jika ada gambar yang dipilih, tambahkan ke FormData
      // if (images) {
      //   formData.append("images", images);
      // }

      // Mengirim permintaan ke server untuk pembaruan produk
      const response = await axios.patch(
        VITE_VERCEL_ENV === "production"
          ? `https://sales-app-server-zeta.vercel.app/products/${uuid}`
          : `http://localhost:5000/products/${uuid}`,
        formData,
        { headers }
      );

      // Menangani respons dari server
      if (response.status === 200) {
        toast.success(response.data.msg);
        // Redirect ke halaman produk setelah pembaruan
        navigate("/products");
      } else {
        toast.error("Failed to update product:", response.data.msg);
      }
    } catch (error) {
      console.error("Error updating product:", error.response);
      toast.error(error.response.data.msg);
    }
  };

  // Fungsi untuk menangani perubahan pada input gambar
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

    // Mengosongkan input file untuk memicu event onChange
    const fileInput = document.getElementById("dropzone-file");
    if (fileInput) {
      fileInput.value = null;
    }
    // Lakukan hal lain yang perlu Anda lakukan setelah menghapus gambar
  };

  return (
    <div style={{ paddingTop: "60px" }}>
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
        <Header category="Page" title="Edit Product" />
        <form method="POST" onSubmit={handleUpdateProduct}>
          <ToastContainer />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
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
                className="block mb-2 text-sm font-medium text-gray-900"
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
            {/* <div>
            <label
              htmlFor="images"
              className="block mb-2 text-sm font-medium text-gray-900"
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
          </div> */}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="mt-4 hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
              style={{ backgroundColor: currentColor }}
            >
              Edit Product
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
    </div>
  );
};

export default EditProduct;
