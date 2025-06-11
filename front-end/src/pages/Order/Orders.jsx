import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Header } from "../../components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useStateContext } from "../../contexts/ContextProvider";
import { FaEye } from "react-icons/fa";
// import { MdOutlineDeleteOutline } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
import CircleLoader from "../../components/CircleLoader";
import { fetchData, getAuthHeaders } from "../../helpers/helpers";
const { VITE_VERCEL_ENV } = import.meta.env;

const Orders = () => {
  const [officerData, setOfficerData] = useState({});
  const { currentColor } = useStateContext();
  const [ordersData, setOrdersData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrdersData = async () => {
    setIsLoading(true);
    const url =
      VITE_VERCEL_ENV === "production"
        ? "https://sales-app-server-zeta.vercel.app/orders"
        : "http://localhost:5000/orders";

    try {
      const data = await fetchData(url, getAuthHeaders());
      setOrdersData(data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOfficerData = async () => {
    setIsLoading(true);
    const url =
      VITE_VERCEL_ENV === "production"
        ? "https://sales-app-server-zeta.vercel.app/me"
        : "http://localhost:5000/me";
    try {
      // Set data officer ke state
      const data = await fetchData(url, getAuthHeaders());
      setOfficerData(data);
    } catch (error) {
      console.error("Error fetching officer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
    fetchOfficerData();
  }, []);

  // Fungsi untuk menghandle penghapusan pesanan
  // const handleDeleteOrder = async (orderUUID) => {
  //   try {
  //     const result = await Swal.fire({
  //       title: "Are you sure?",
  //       text: "You will not be able to recover this data!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "Cancel",
  //       reverseButtons: true,
  //     });

  //     if (result.isConfirmed) {
  //       // Mengambil token dari local storage
  //       const token = localStorage.getItem("token");

  //       // Menyiapkan header Authorization dengan menggunakan token
  //       const headers = {
  //         Authorization: `Bearer ${token}`,
  //       };

  //       // Kirim permintaan DELETE ke endpoint API untuk menghapus pesanan
  //       const response = await axios.delete(
  //         VITE_VERCEL_ENV === "production"
  //           ? `https://sales-app-server-zeta.vercel.app/orders/${orderUUID}`
  //           : `http://localhost:5000/orders/${orderUUID}`,
  //         {
  //           headers,
  //         }
  //       );

  //       if (response.status === 200) {
  //         // Tampilkan SweetAlert untuk informasi penghapusan berhasil
  //         Swal.fire({
  //           title: "Deleted!",
  //           text: `${response.data.msg}`,
  //           icon: "success",
  //         });

  //         // Perbarui data pesanan setelah penghapusan berhasil
  //         fetchOrdersData();
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.msg);
  //   }
  // };

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
    <div className="pt-[60px] md:pt-0">
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
        <Header category="Page" title="Orders" />
        {isCashier && (
          <Link to="/addorder">
            <Button
              type="button"
              color="white"
              bgColor={currentColor}
              borderRadius="10px"
            >
              Add Orders
            </Button>
          </Link>
        )}
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          {isLoading ? (
            <CircleLoader /> // Menampilkan Loader saat data sedang dimuat
          ) : (
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
                {/* Check apakah order datanya ada atau tidak */}
                {ordersData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Data
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0
                    ? ordersData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : ordersData
                  ).map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{order.orderNumber}</TableCell>
                      <TableCell align="center">
                        {order.customer.name}
                      </TableCell>
                      <TableCell align="center">
                        {`Rp. ${Number(order.totalPrice).toLocaleString(
                          "id-ID"
                        )}`}
                      </TableCell>
                      <TableCell align="center">
                        {order.invoice.paymentType}
                      </TableCell>
                      <TableCell align="center">
                        {renderActionButtons(order)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
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
    </div>
  );
};

export default Orders;
