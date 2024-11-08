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
import axios from "axios";

const ActivityLog = () => {
  const [officerData, setOfficerData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get all data logs
  useEffect(() => {
    const fetchLogData = async () => {
      try {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get("https://sales-app-server-zeta.vercel.app/activitylog", {
          headers,
        });
        setLogData(response.data);
      } catch (error) {
        console.log("Error fetching logs data:", error.response.data);
      }
    };
    fetchLogData();
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
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Logs" title="Activity Log" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell align="center">Officer ID</TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Target</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? logData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : logData
            ).map((activitylog) => (
              <TableRow
                key={activitylog.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{activitylog.officerId}</TableCell>
                <TableCell align="center">{activitylog.action}</TableCell>
                <TableCell align="center">{activitylog.target}</TableCell>
                <TableCell align="center">{activitylog.createdAt}</TableCell>
                <TableCell align="center">{activitylog.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          style={{ backgroundColor: "#F5F5F5" }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={logData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default ActivityLog;
