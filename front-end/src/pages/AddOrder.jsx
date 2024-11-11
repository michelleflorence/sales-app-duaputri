import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../helpers/helpers";

const { VITE_VERCEL_ENV } = import.meta.env;

const AddOrder = () => {
  const navigate = useNavigate();
  const { currentColor } = useStateContext();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [items, setItems] = useState([{ uuid: "", qty: 0 }]); // State untuk menyimpan daftar item
  const [productList, setProductList] = useState([]);

  // Fungsi untuk menambah item pesanan ke dalam daftar
  const handleAddItem = () => {
    setItems([...items, { uuid: "", qty: 0 }]);
  };

  // Fungsi untuk mengupdate nilai qty atau uuid pada suatu item dalam daftar
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Efek samping untuk mengambil daftar produk saat komponen dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const headers = getAuthHeaders();

        // Mengirim permintaan ke server untuk mendapatkan data produk
        const response = await axios.get(
          VITE_VERCEL_ENV === "production"
            ? `https://sales-app-server-zeta.vercel.app/products/`
            : `http://localhost:5000/products/`,
          {
            headers,
          }
        );

        setProductList(response.data); // Menyimpan daftar produk ke dalam state
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);

  // Fungsi untuk menambah pesanan baru
  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      // Mengambil token dari local storage
      const headerToken = getAuthHeaders();

      // Mengirim permintaan ke server untuk menambah pesanan
      const response = await axios.post(
        VITE_VERCEL_ENV === "production"
          ? "https://sales-app-server-zeta.vercel.app/orders"
          : "http://localhost:5000/orders",
        {
          customerName,
          customerPhone,
          items,
          paymentType,
        },
        { headers: headerToken }
      );

      // Menangani respons dari server
      if (response.status === 201) {
        // Menampilkan notifikasi sukses
        toast.success(response.data.msg);

        const newOrderId = response.data.uuid;

        // Redirect ke halaman detail pesanan setelah penambahan
        navigate(`/vieworder/${newOrderId}`);
      } else {
        toast.error("Failed to create order:", response.data.msg); // Menampilkan notifikasi gagal
      }
    } catch (error) {
      // Log error untuk debugging
      if (error.response) {
        console.error("Detailed Error Response:", error.response.data);
      }

      toast.error(error.response.data.msg); // Menampilkan notifikasi gagal dari respons server
    }
  };

  return (
    <div style={{ paddingTop: "60px" }}>
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
        <Header category="Page" title="Add Order" />
        <form method="POST" onSubmit={handleAddOrder}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Customer Name
              </label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type customer name"
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
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                type="text"
                name="phone"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type customer phone"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="items"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Items
              </label>
              {items.map((item, index) => (
                <div key={index} className="flex items-center mb-2 gap-4">
                  <select
                    name={`item-${index}`}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex-1 p-2.5"
                    value={item.uuid}
                    // Menangani perubahan pada dropdown dan memperbarui nilai uuid pada item
                    onChange={(e) =>
                      handleItemChange(index, "uuid", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Product
                    </option>
                    {/* Mapping dan menampilkan opsi untuk setiap produk */}
                    {productList
                      .filter((product) => product.status === 0)
                      .map((product) => (
                        <option key={product.id} value={product.uuid}>
                          {product.productName}
                        </option>
                      ))}
                  </select>

                  <input
                    type="number"
                    name={`qty-${index}`}
                    placeholder="Enter quantity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 flex-1 p-2.5"
                    value={item.qty}
                    // Menangani perubahan pada input dan memperbarui nilai qty pada item
                    onChange={(e) => {
                      // Pastikan nilai qty tidak kurang dari 0
                      const newValue = Math.max(
                        0,
                        parseInt(e.target.value, 10)
                      );
                      handleItemChange(index, "qty", newValue);
                    }}
                    required
                  />
                  {/* Tombol + untuk menambah item baru */}
                  {/* Mengecek apakah item saat ini merupakan item terakhir dalam array items. */}
                  {index === items.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="ml-1 bg-teal-900 hover:bg-teal-700 text-white px-4 py-2 rounded"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <label
                htmlFor="paymentType"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Payment Type
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                name="paymentType"
                id="paymentType"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              >
                <option value="Cash">Cash</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="mt-4 hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
              style={{ backgroundColor: currentColor }}
            >
              Add Order
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
    </div>
  );
};

export default AddOrder;
