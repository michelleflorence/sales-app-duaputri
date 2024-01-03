import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Officers = () => {
  const { currentColor } = useStateContext();
  const [officersData, setOfficers] = useState([]);
  const [loginOfficerData, setLoginOfficerData] = useState([]);

  // Get data officers
  const fetchOfficersData = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("http://localhost:5000/officers", {
        headers,
      });

      setOfficers(response.data);
    } catch (error) {
      console.error("Error fetching officers data:", error);
    }
  };

  // Panggil fetchOfficersData dalam useEffect
  useEffect(() => {
    fetchOfficersData();
  }, []);

  // Delete data officer by UUID
  const handleDeleteOfficer = async (officerUUID) => {
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

        // Kirim permintaan DELETE ke endpoint API untuk menghapus officer
        // Kirim permintaan DELETE ke endpoint API untuk menghapus officer
        const response = await axios.delete(
          `http://localhost:5000/officers/${officerUUID}`,
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

          // Perbarui data officer setelah penghapusan berhasil
          fetchOfficersData();
        }
      }
    } catch (error) {
      console.error("Error deleting officer:", error);
      toast.error(error.response.data.msg);
    }
  };

  // Fungsi untuk mengambil data officer yang sedang login
  useEffect(() => {
    const fetchLoginOfficerData = async () => {
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
        setLoginOfficerData(response.data);
      } catch (error) {
        console.error("Error fetching officer data:", error);
      }
    };

    fetchLoginOfficerData();
  }, []);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Officers" />
      <Link to="/addofficer">
        <button
          type="button"
          className="hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
          style={{ backgroundColor: currentColor }}
        >
          Add Officer
        </button>
      </Link>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell align="center">Officer Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Roles</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {officersData
              .filter((officer) => {
                // Filter data berdasarkan officer yang login
                if (loginOfficerData.roles === "superadmin") {
                  // Jika yang login adalah superadmin, filter data yang tidak memiliki peran superadmin
                  return officer.roles !== "superadmin";
                }
                // Jika yang login bukan superadmin, tampilkan semua data
                return true;
              })
              .map((officer) => (
                <TableRow
                  key={officer.name} // Tambahkan key di sini
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{officer.name}</TableCell>
                  <TableCell align="center">{officer.email}</TableCell>
                  <TableCell align="center">{officer.roles}</TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/viewofficer/${officer.uuid}`}>
                        <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-emerald-500 text-white bg-emerald-700 rounded-full">
                          <FaEye />
                        </button>
                      </Link>
                      <Link to={`/editofficer/${officer.uuid}`}>
                        <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-blue-500 text-white bg-blue-700 rounded-full">
                          <FiEdit />
                        </button>
                      </Link>
                      <button
                        className="text-md p-3 hover:drop-shadow-md hover:bg-red-500 text-white bg-red-700 rounded-full"
                        onClick={() => handleDeleteOfficer(officer.uuid)}
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Officers;
