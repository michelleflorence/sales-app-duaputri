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
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Customers = () => {
  const [officerData, setOfficerData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get all data customer
  const fetchCustomersData = async () => {
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
      setCustomersData(response.data.customers);
    } catch (error) {
      console.log("Error fetching customers data:", error.response.data);
    }
  };

  // Panggil fetchCustomersData dalam useEffect
  useEffect(() => {
    fetchCustomersData();
  }, []);

  // Delete data customer by UUID
  const handleDeleteCustomer = async (customerUUID) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Kirim permintaan DELETE ke endpoint API untuk menghapus pelanggan
        const response = await axios.delete(
          `http://localhost:5000/customers/${customerUUID}`,
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

          // Perbarui data pelanggan setelah penghapusan berhasil
          fetchCustomersData();
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

  // Menentukan apakah officer memiliki peran cashier
  const isCashier = officerData.roles === "kasir";

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Customers" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Customer Phone</TableCell>
              {isCashier && <TableCell align="center">Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? customersData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : customersData
            ).map((customer) => (
              <TableRow
                key={customer.uuid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{customer.name}</TableCell>
                <TableCell align="center">{customer.phone}</TableCell>
                {isCashier && (
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/editcustomer/${customer.uuid}`}>
                        <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-blue-500 dark:hover:bg-light-gray text-white bg-blue-700 rounded-full">
                          <FiEdit />
                        </button>
                      </Link>
                      <button
                        className="text-md p-3 hover:drop-shadow-md hover:bg-red-500 dark:hover:bg-light-gray text-white bg-red-700 rounded-full"
                        onClick={() => handleDeleteCustomer(customer.uuid)}
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
          count={customersData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default Customers;
