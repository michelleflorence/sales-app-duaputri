import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import blank from "../data/blank.jpg";
import { GridProductStatus } from "../data/dummy";

const Products = () => {
  const [officerData, setOfficerData] = useState({});
  const { currentColor } = useStateContext();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get all data product
  const fetchProductsData = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("http://localhost:5000/products", {
        headers,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };

  // Panggil fetchProductsData dalam useEffect
  useEffect(() => {
    fetchProductsData();
  }, []);

  // Delete data officer by UUID
  const handleDeleteProduct = async (productUUID) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Kirim permintaan DELETE ke endpoint API untuk menghapus product
        const response = await axios.delete(
          `http://localhost:5000/products/${productUUID}`,
          {
            headers,
          }
        );

        if (response.status === 200) {
          // Tampilkan SweetAlert untuk informasi penghapusan berhasil
          Swal.fire({
            title: "Deleted!",
            text: `${response.data.msg}`,
            icon: "success",
          });

          // Perbarui data produk setelah penghapusan berhasil
          fetchProductsData();
        }
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

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
        const response = await axios.get("http://localhost:5000/me", {
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
  const isAdmin = officerData.roles === "admin";

  const handleChangePage = (event, newPage) => {
    // Fungsi ini dipanggil saat pengguna mengubah halaman pada tata letak paginasi.

    // Parameter 'event' mungkin digunakan di implementasi lain,
    // namun di sini kita hanya memerlukannya untuk mendapatkan nilai 'newPage'.

    // 'newPage': Parameter ini berisi nilai halaman baru yang dipilih oleh pengguna.
    // Nilai ini diterima dari komponen paginasi dan akan digunakan untuk
    // memperbarui state 'page', sehingga tata letak dapat diubah sesuai.

    // Memanggil 'setPage(newPage)' untuk mengatur state 'page' dengan nilai 'newPage',
    // sehingga komponen dapat merender dengan halaman yang sesuai.

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // Mengubah nilai jumlah baris per halaman yang dipilih oleh pengguna
    // dari tipe string menjadi tipe bilangan bulat menggunakan parseInt.
    // Parameter 10 menunjukkan penggunaan sistem bilangan desimal (base 10).
    setRowsPerPage(parseInt(event.target.value, 10));

    // Setelah mengatur jumlah baris per halaman, atur halaman aktif kembali ke halaman pertama
    setPage(0);
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Products" />
      {isAdmin && (
        <Link to="/addproduct">
          <button
            type="button"
            className="hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
            style={{ backgroundColor: currentColor }}
          >
            Add Product
          </button>
        </Link>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell align="center">Product Name</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Status</TableCell>
              {isAdmin && <TableCell align="center">Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? products.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : products
            ).map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{product.productName}</TableCell>
                <TableCell align="center">
                  {`Rp. ${Number(product.price).toLocaleString("id-ID")}`}
                </TableCell>
                <TableCell align="center">
                  <div
                    className="image flex gap-4"
                    style={{ textAlign: "center" }}
                  >
                    {product.images ? (
                      <img
                        className="rounded-md w-20 h-20"
                        src={`http://localhost:5000/uploads/${product.images}`}
                        alt="Product Images"
                        style={{ margin: "auto", objectFit: "cover" }}
                      />
                    ) : (
                      <img
                        className="rounded-md w-20 h-20"
                        src={blank}
                        alt="Product Images"
                        style={{ margin: "auto", objectFit: "cover" }}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell align="center">
                  <GridProductStatus
                    Status={product.status === 0 ? "Available" : "Empty"}
                    StatusBg={product.status === 0 ? "#478778" : "#D22B2B"}
                  />
                </TableCell>
                {isAdmin && (
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/editproduct/${product.uuid}`}>
                        <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-blue-500 dark:hover:bg-light-gray text-white bg-blue-700 rounded-full">
                          <FiEdit />
                        </button>
                      </Link>
                      <button
                        className="text-md p-3 hover:drop-shadow-md hover:bg-red-500 dark:hover:bg-light-gray text-white bg-red-700 rounded-full"
                        onClick={() => handleDeleteProduct(product.uuid)}
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          style={{ backgroundColor: "#F5F5F5" }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default Products;
