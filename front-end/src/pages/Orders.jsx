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
import { FaEye } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Orders = () => {
  const [officerData, setOfficerData] = useState({});
  const { currentColor } = useStateContext();
  const [ordersData, setOrdersData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchOrdersData = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("https://sales-app-server-zeta.vercel.app/orders", {
        headers,
      }); // Replace 'your_api_endpoint' with the actual API endpoint
      setOrdersData(response.data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  // Fungsi untuk menghandle penghapusan pesanan
  const handleDeleteOrder = async (orderUUID) => {
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

        // Kirim permintaan DELETE ke endpoint API untuk menghapus pesanan
        const response = await axios.delete(
          `https://sales-app-server-zeta.vercel.app/orders/${orderUUID}`,
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

          // Perbarui data pesanan setelah penghapusan berhasil
          fetchOrdersData();
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
        const response = await axios.get("https://sales-app-server-zeta.vercel.app/me", {
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

  // Menentukan apakah officer memiliki peran superadmin
  const isSuperAdmin = officerData.roles === "superadmin";

  // Menentukan apakah officer memiliki peran cashier
  const isCashier = officerData.roles === "kasir";

  // Fungsi untuk merender tombol aksi berdasarkan peran officer
  const renderActionButtons = (order) => {
    if (isSuperAdmin) {
      // Jika officer adalah superadmin, hanya tampilkan tombol 'View'
      return (
        <Link to={`/vieworder/${order.uuid}`}>
          <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-emerald-500 text-white bg-emerald-700 rounded-full">
            <FaEye />
          </button>
        </Link>
      );
    } else if (isCashier) {
      // Jika officer adalah cashier, tampilkan semua tombol aksi
      return (
        <div className="flex items-center justify-center gap-2">
          <Link to={`/vieworder/${order.uuid}`}>
            <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-emerald-500 text-white bg-emerald-700 rounded-full">
              <FaEye />
            </button>
          </Link>
        </div>
      );
    } else {
      // Default: Jika officer memiliki peran lain, tidak tampilkan tombol aksi
      return null;
    }
  };

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
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Orders" />
      {isCashier && (
        <Link to="/addorder">
          <button
            type="button"
            className="hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
            style={{ backgroundColor: currentColor }}
          >
            Add Orders
          </button>
        </Link>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell align="center">Order Number</TableCell>
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Total Price</TableCell>
              <TableCell align="center">Payment Type</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? // Jika jumlah baris per halaman lebih dari 0, artinya paginasi diaktifkan.
                // Tampilkan sejumlah baris sesuai dengan nilai 'rowsPerPage' dan halaman aktif.
                ordersData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : // Jika jumlah baris per halaman 0 atau kurang, artinya paginasi dinonaktifkan.
                // Dalam hal ini, tampilkan semua pesanan yang ada.
                ordersData
            ).map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{order.orderNumber}</TableCell>
                <TableCell align="center">{order.customer.name}</TableCell>
                <TableCell align="center">
                  {`Rp. ${Number(order.totalPrice).toLocaleString("id-ID")}`}
                </TableCell>
                <TableCell align="center">
                  {order.invoice.paymentType}
                </TableCell>
                <TableCell align="center">
                  {renderActionButtons(order)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          style={{ backgroundColor: "#F5F5F5" }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ordersData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default Orders;
