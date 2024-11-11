import React, { useState, useEffect } from "react";
import { Header } from "../components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.css";
import { fetchData, getAuthHeaders } from "../helpers/helpers";
import CircleLoader from "../components/CircleLoader";
const { VITE_VERCEL_ENV } = import.meta.env;

const Customers = () => {
  const [customersData, setCustomersData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  // Get all data customer
  const fetchCustomersData = async () => {
    setIsLoading(true);
    const url =
      VITE_VERCEL_ENV === "production"
        ? "https://sales-app-server-zeta.vercel.app/customers"
        : "http://localhost:5000/customers";
    try {
      const data = await fetchData(url, getAuthHeaders());
      setCustomersData(data.customers);
    } catch (error) {
      console.log("Error fetching customers data:", error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
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

  return (
    <div style={{ paddingTop: "60px" }}>
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
        <Header category="Page" title="Customers" />
        <TableContainer component={Paper}>
          {isLoading ? (
            <CircleLoader />
          ) : (
            <>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{ backgroundColor: "#F5F5F5" }}>
                  <TableRow>
                    <TableCell align="center">Customer Name</TableCell>
                    <TableCell align="center">Customer Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customersData.length > 0 ? (
                    (rowsPerPage > 0
                      ? customersData.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : customersData
                    ).map((customer) => (
                      <TableRow
                        key={customer.uuid}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{customer.name}</TableCell>
                        <TableCell align="center">{customer.phone}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No Data
                      </TableCell>
                    </TableRow>
                  )}
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
            </>
          )}
        </TableContainer>
      </div>
    </div>
  );
};

export default Customers;
